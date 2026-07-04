import { NextRequest, NextResponse } from "next/server";
import { kvGetFallbacks, kvClearFallbacks } from "@/lib/analytics/kv";

const REPO = "shaneweickum-lab/Brass-Note-Studios";
const MIN_FALLBACKS = 3; // skip the run if fewer than this many unique questions

// ── Auth ────────────────────────────────────────────────────────────────────

function isAuthorized(req: NextRequest): boolean {
  // Vercel sends the CRON_SECRET as a Bearer token on scheduled invocations.
  // The same secret can be used to trigger the endpoint manually for testing.
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) return false;
  const auth = req.headers.get("authorization") ?? "";
  return auth === `Bearer ${cronSecret}`;
}

// ── Deduplicate fallbacks ───────────────────────────────────────────────────

function dedup(entries: { userMsg: string; pageContext: string }[]) {
  const map = new Map<string, { count: number; pages: Set<string> }>();
  for (const { userMsg, pageContext } of entries) {
    const key = userMsg.toLowerCase().trim();
    if (!map.has(key)) map.set(key, { count: 0, pages: new Set() });
    const rec = map.get(key)!;
    rec.count++;
    rec.pages.add(pageContext);
  }
  return Array.from(map.entries())
    .map(([msg, { count, pages }]) => ({ msg, count, pages: Array.from(pages) }))
    .sort((a, b) => b.count - a.count);
}

// ── Call Claude to analyse and draft patterns ───────────────────────────────

async function analyzeWithClaude(questions: { msg: string; count: number; pages: string[] }[]): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY not set");

  const questionList = questions
    .map((q) => `- "${q.msg}" (asked ${q.count}× on: ${q.pages.join(", ")})`)
    .join("\n");

  const systemPrompt = `You are a knowledge-base engineer for Brass Note Studios, a bespoke songwriting and production atelier. You maintain an AIML 2.0 chatbot called the Atelier Concierge.

Your task: analyse a list of unanswered visitor questions (fallbacks) and draft AIML patterns to cover them.

AIML file guide — add patterns to the file that best fits the topic:
- pricing.aiml — cost, fees, pricing, packages, add-ons
- commissions.aiml — process, how it works, gifting, deadlines, genres, file formats
- revisions.aiml — revisions, changes, refunds, satisfaction
- royalties.aiml — ownership, rights, royalties, licensing, PRO
- about.aiml — studio identity, quality, AI/Suno, founders, samples/portfolio
- labs.aiml — Brass Note Labs, research, experimental work
- contact.aiml — response time, contact methods, getting started
- core.aiml — greetings, thanks, small talk, off-topic deflection

AIML format:
\`\`\`xml
<!-- Primary pattern — full answer -->
<category>
  <pattern>HOW LONG IS THE SONG</pattern>
  <template>Our standard commissions run 3–4 minutes, though we can adjust length to suit your project. Just note your preference in the inquiry form and we will accommodate it.
    <nav-card label="Start Your Commission" href="/contact"/>
  </template>
</category>

<!-- Variations — srai to primary -->
<category>
  <pattern>HOW LONG WILL IT BE</pattern>
  <template><srai>HOW LONG IS THE SONG</srai></template>
</category>
\`\`\`

Atelier voice rules (non-negotiable):
- 2–4 sentences, warm and precise, never stiff
- "We/our" framing — never "I"
- No bullet points in answers
- Never use: certainly, absolutely, of course, happy to help, great question
- Include a <nav-card> when a page is relevant

Output format: a GitHub Issue body in clean markdown. Structure:

## Summary
| Theme | Questions | Target file |
|---|---|---|
| ... | N | filename.aiml |

---

## [Theme name]
**Sample questions:**
> "question 1"
> "question 2"

**Add to \`filename.aiml\`:**
\`\`\`xml
... AIML here ...
\`\`\`

---

Skip any question that is clearly spam, nonsense, or already covered by existing greetings/thanks/off-topic deflection patterns. Focus on genuine product questions with no good answer.`;

  const userPrompt = `Here are the unanswered visitor questions from the past 48 hours:\n\n${questionList}\n\nPlease group them by theme, draft AIML patterns for each group, and produce the fix document.`;

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 4096,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Claude API error ${res.status}: ${err}`);
  }

  const data = await res.json() as { content: { type: string; text: string }[] };
  const text = data.content.find((b) => b.type === "text")?.text ?? "";
  if (!text) throw new Error("Claude returned empty response");
  return text;
}

// ── Create GitHub Issue ─────────────────────────────────────────────────────

async function createGithubIssue(title: string, body: string): Promise<string> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) throw new Error("GITHUB_TOKEN not set");

  const res = await fetch(`https://api.github.com/repos/${REPO}/issues`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github.v3+json",
      "Content-Type": "application/json",
      "User-Agent": "BrassNoteStudios-ConciergeBot/1.0",
    },
    body: JSON.stringify({
      title,
      body,
      labels: ["concierge-fix"],
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`GitHub API error ${res.status}: ${err}`);
  }

  const issue = await res.json() as { html_url: string; number: number };
  return issue.html_url;
}

// ── Handler ─────────────────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // 1. Read fallbacks from Redis
    const raw = await kvGetFallbacks();
    if (!raw.length) {
      return NextResponse.json({ ok: true, skipped: "no fallbacks" });
    }

    const questions = dedup(raw);
    if (questions.length < MIN_FALLBACKS) {
      return NextResponse.json({ ok: true, skipped: `only ${questions.length} unique questions — below threshold` });
    }

    // 2. Call Claude to analyse and draft AIML patterns
    const fixDocument = await analyzeWithClaude(questions);

    // 3. Create GitHub Issue
    const now = new Date().toISOString().slice(0, 10);
    const title = `Concierge Fix Document — ${now} (${questions.length} questions)`;

    const issueBody = `> **Auto-generated by BNSignal Concierge Analyzer**
> Review the suggested patterns below. When ready, add the \`approved\` label to trigger automatic implementation.

---

${fixDocument}`;

    const issueUrl = await createGithubIssue(title, issueBody);

    // 4. Clear the processed fallbacks from Redis
    await kvClearFallbacks();

    console.log(`[cron:analyze-fallbacks] Issue created: ${issueUrl}`);
    return NextResponse.json({ ok: true, issueUrl, questionCount: questions.length });

  } catch (err) {
    console.error("[cron:analyze-fallbacks]", err);
    return NextResponse.json(
      { error: "Analysis failed", detail: String(err) },
      { status: 500 }
    );
  }
}
