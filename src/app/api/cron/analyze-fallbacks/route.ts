import { NextRequest, NextResponse } from "next/server";
import {
  kvGetFallbacks,
  kvGetPageViews,
  kvGetConversations,
  kvClearFallbacks,
} from "@/lib/analytics/kv";

const REPO = "shaneweickum-lab/Brass-Note-Studios";
const MIN_FALLBACKS = 3;

// ── Auth ────────────────────────────────────────────────────────────────────

function isAuthorized(req: NextRequest): boolean {
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) return false;
  const auth = req.headers.get("authorization") ?? "";
  return auth === `Bearer ${cronSecret}`;
}

// ── Helpers ─────────────────────────────────────────────────────────────────

function dedupFallbacks(entries: { userMsg: string; pageContext: string }[]) {
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

function buildPageSummary(pageViews: { path: string }[]) {
  const map = new Map<string, number>();
  for (const { path } of pageViews) {
    map.set(path, (map.get(path) ?? 0) + 1);
  }
  return Array.from(map.entries())
    .map(([page, views]) => ({ page, views }))
    .sort((a, b) => b.views - a.views);
}

function buildTopicSignals(
  conversations: { pageContext: string; matchedPattern?: string; isFallback: boolean }[]
) {
  // Which pages generated the most conversation?
  const pageEngagement = new Map<string, number>();
  for (const c of conversations) {
    pageEngagement.set(c.pageContext, (pageEngagement.get(c.pageContext) ?? 0) + 1);
  }
  return Array.from(pageEngagement.entries())
    .map(([page, msgs]) => ({ page, msgs }))
    .sort((a, b) => b.msgs - a.msgs)
    .slice(0, 8);
}

// ── Claude calls ─────────────────────────────────────────────────────────────

async function callClaude(system: string, user: string): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY not set");

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
      system,
      messages: [{ role: "user", content: user }],
    }),
  });

  if (!res.ok) throw new Error(`Claude API error ${res.status}: ${await res.text()}`);

  const data = await res.json() as { content: { type: string; text: string }[] };
  const text = data.content.find((b) => b.type === "text")?.text ?? "";
  if (!text) throw new Error("Claude returned empty response");
  return text;
}

async function analyzeForAimlFix(
  questions: { msg: string; count: number; pages: string[] }[]
): Promise<string> {
  const questionList = questions
    .map((q) => `- "${q.msg}" (asked ${q.count}× on: ${q.pages.join(", ")})`)
    .join("\n");

  const system = `You are a knowledge-base engineer for Brass Note Studios, a bespoke songwriting and production atelier. You maintain an AIML 2.0 chatbot called Benny (BNAI).

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

Output format — a GitHub Issue body in clean markdown:

## Summary
| Theme | Questions | Target file |
|---|---|---|
| ... | N | filename.aiml |

---

## [Theme name]
**Sample questions:**
> "question 1"

**Add to \`filename.aiml\`:**
\`\`\`xml
... AIML here ...
\`\`\`

---

Skip spam, nonsense, or anything already covered by greetings/thanks/off-topic patterns. Focus on genuine product questions with no good answer.`;

  const user = `Here are the unanswered visitor questions from the past 48 hours:\n\n${questionList}\n\nGroup them by theme, draft AIML patterns for each group, and produce the fix document.`;

  return callClaude(system, user);
}

async function analyzeForJournalTopics(
  questions: { msg: string; count: number; pages: string[] }[],
  pageStats: { page: string; views: number }[],
  engagement: { page: string; msgs: number }[]
): Promise<string> {
  const questionList = questions
    .slice(0, 30)
    .map((q) => `- "${q.msg}" (${q.count}× on ${q.pages.join(", ")})`)
    .join("\n");

  const pageList = pageStats
    .map((p) => `- ${p.page} — ${p.views} views`)
    .join("\n");

  const engagementList = engagement
    .map((e) => `- ${e.page} — ${e.msgs} concierge messages`)
    .join("\n");

  const system = `You are a content strategist for Brass Note Studios, a bespoke songwriting and production atelier. You help plan their Journal — a thoughtful blog that reflects the studio's warm, precise voice.

Your task: given visitor data, suggest 5–7 specific Journal post topics that would genuinely serve the audience and support the business.

About the audience: people considering a custom song commission — for a wedding, anniversary, birthday, organizational anthem, or content creation. They have questions, doubts, and moments of wonder about the process.

About the Journal voice:
- Warm, personal, precise — not corporate, not listicle-y
- Stories over how-tos (e.g. "The Song We Almost Didn't Make" beats "5 Tips for Commissioning Music")
- First-person plural ("we discovered", "our clients often tell us")
- Each post should leave the reader either ready to commission or deeply trusting of the studio

Output format — a GitHub Issue body in clean markdown:

## Suggested Journal Topics — [date]

_Based on visitor questions and site engagement from the past 48 hours._

---

### [Suggested post title — write it as a real headline, not a placeholder]
**Why this topic:** [1–2 sentences on what data signal suggested it]
**Angle:** [The specific emotional or narrative hook — what makes this interesting vs. generic]
**Target reader:** [Who this speaks to — e.g. "someone gifting a commission" / "a creator building a brand"]
**Opens a door to:** [What action this might prompt — e.g. "individual commission inquiry"]

---

Be specific. "What Happens After You Hit Send" is a good title. "Commission Process" is not. The goal is topics Shane can sit down and write from personal experience — not research projects.`;

  const user = `Here is the visitor data from the past 48 hours:

**Unanswered concierge questions (content gaps):**
${questionList || "None recorded"}

**Page traffic:**
${pageList || "No page views recorded"}

**Pages generating the most concierge conversation:**
${engagementList || "No conversation data"}

Please suggest 5–7 Journal topics based on this data.`;

  return callClaude(system, user);
}

// ── GitHub ────────────────────────────────────────────────────────────────────

async function createGithubIssue(
  title: string,
  body: string,
  labels: string[]
): Promise<string> {
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
    body: JSON.stringify({ title, body, labels }),
  });

  if (!res.ok) throw new Error(`GitHub API error ${res.status}: ${await res.text()}`);

  const issue = await res.json() as { html_url: string; number: number };
  return issue.html_url;
}

// ── Handler ──────────────────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const now = new Date().toISOString().slice(0, 10);

    // 1. Fetch all data in parallel
    const [rawFallbacks, pageViews, conversations] = await Promise.all([
      kvGetFallbacks(),
      kvGetPageViews(),
      kvGetConversations(),
    ]);

    const questions = dedupFallbacks(rawFallbacks);
    const pageStats = buildPageSummary(pageViews);
    const engagement = buildTopicSignals(conversations);

    if (questions.length < MIN_FALLBACKS && pageStats.length === 0) {
      return NextResponse.json({ ok: true, skipped: "insufficient data" });
    }

    // 2. Run both Claude analyses in parallel
    const [aimlDocument, journalDocument] = await Promise.all([
      questions.length >= MIN_FALLBACKS
        ? analyzeForAimlFix(questions)
        : Promise.resolve(null),
      analyzeForJournalTopics(questions, pageStats, engagement),
    ]);

    // 3. Create both GitHub issues in parallel
    const issueJobs: Promise<string>[] = [];

    if (aimlDocument) {
      const body = `> **Auto-generated by BNSignal — Benny (BNAI) Analyzer**
> Review the suggested patterns below. When ready, add the \`approved\` label to trigger automatic implementation.

---

${aimlDocument}`;
      issueJobs.push(
        createGithubIssue(
          `Concierge Fix Document — ${now} (${questions.length} questions)`,
          body,
          ["concierge-fix"]
        )
      );
    }

    issueJobs.push(
      createGithubIssue(
        `Journal Topics — ${now}`,
        `> **Auto-generated by BNSignal** — pick whichever topic resonates, write when ready. No action required beyond reading.

---

${journalDocument}`,
        ["journal-topics"]
      )
    );

    const issueUrls = await Promise.all(issueJobs);

    // 4. Clear the processed fallbacks from Redis
    await kvClearFallbacks();

    console.log("[cron:analyze-fallbacks] Issues created:", issueUrls);
    return NextResponse.json({
      ok: true,
      issues: issueUrls,
      questionCount: questions.length,
      pageViewCount: pageViews.length,
    });

  } catch (err) {
    console.error("[cron:analyze-fallbacks]", err);
    return NextResponse.json(
      { error: "Analysis failed", detail: String(err) },
      { status: 500 }
    );
  }
}
