# Brass Note Studios

Custom songwriting and production atelier. Clients commission bespoke songs for personal milestones, organizations, and content creation. Songs are written and produced with Suno AI; the process is fully transparent on the About page.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 3 |
| Forms | React Hook Form + Resend |
| Charts | Recharts |
| Icons | Lucide React |
| Analytics store | Upstash Redis (via `@upstash/redis`) |
| Deployment | Vercel |
| Chatbot patterns | Custom AIML 2.0 engine (hand-built in TypeScript) |
| AI analysis | Anthropic Claude Haiku (via cron route) |
| Automation | GitHub Actions + Claude Code CLI |

---

## Pages and Routes

| Route | Description |
|---|---|
| `/` | Home — hero, service cards, featured music, about snippet, testimonials |
| `/services` | Commission tiers, process steps, FAQ |
| `/music` | Full portfolio — filterable track list with global audio player |
| `/about` | Studio story, Suno AI transparency, team |
| `/contact` | Commission inquiry form |
| `/blog` | Journal (Markdown posts, optional) |
| `/labs` | Brass Note Labs — experimental research division |
| `/method` | How the studio works — production methodology |
| `/heirloom` | Heirloom Collection (hidden; gated until supply chain is ready) |
| `/academy` | Future academy (placeholder) |
| `/admin/analytics` | BNSignal overview dashboard (Basic Auth) |
| `/admin/analytics/website` | Page-level traffic (Basic Auth) |
| `/admin/analytics/concierge` | Concierge pattern hit/fallback analysis (Basic Auth) |
| `/admin/analytics/journey` | Session-level user journey viewer (Basic Auth) |
| `/admin/analytics/raw` | Raw JSONL log viewer (Basic Auth) |

---

## Color Palette and Typography

Defined in `tailwind.config.ts`:

```
background       #0D0A0B   near-black body
surface          #1A1114   card backgrounds
surface-elevated #251820   hover / active card state
gold.DEFAULT     #C9921A   primary accent, buttons
gold.light       #E8B84B   text on dark (WCAG AA compliant)
text.DEFAULT     #F5F0E8   warm white
text.muted       #8B7D6B   secondary text
```

- **Display font:** Playfair Display (serif) — headings, hero text
- **Body font:** Inter (sans-serif) — body copy, UI elements

---

## Music Player Architecture

A single `<audio>` element lives inside `PlayerProvider` (mounted in `src/app/layout.tsx`) and persists across page navigations — only `audio.src` is swapped when the track changes.

- **`TrackCard`** calls `context.play(song.id)` — no per-card audio elements
- Play/pause state is derived from `context.currentSongId === song.id && context.playerState === 'playing'`
- Auto-advance: `audio.addEventListener('ended', ...)` advances to next track in queue
- **`PlaylistPlayer`** is a sticky bottom bar visible when `playerState !== 'idle'`; shows title, client name, prev/play-pause/next controls, scrubber, and volume
- If `mp3Url` fails: `playerState → 'error'`; the card shows an external "Listen on Suno" link

### Adding Songs

1. Produce in Suno, copy the direct MP3 URL
2. Open `src/data/songs.json` in GitHub's web editor
3. Add an entry:

```json
{
  "id": "song-001",
  "title": "Golden Years",
  "clientName": "The Johnson Family",
  "description": "50th anniversary celebration",
  "category": "Personal Lyrics",
  "genre": "Soul",
  "featured": true,
  "publishedDate": "2024-01-15",
  "audioSource": {
    "type": "mp3",
    "mp3Url": "https://cdn.suno.ai/abc123.mp3",
    "sunoUrl": "https://suno.com/song/abc123"
  },
  "coverImage": null
}
```

4. Set `featured: true` to surface the track on the home page
5. Commit → Vercel auto-deploys in ~90 seconds

---

## Atelier Concierge (Chatbot)

The site includes a custom AIML 2.0 chatbot called **The Atelier Concierge**, accessible as a floating chat panel sitewide. It is a zero-dependency TypeScript implementation — no AIML library is used.

### Engine Files

```
chatbot/
├── config.ts                   # Global config (bot name, turn limit, feature flags)
├── aiml/                       # Pattern knowledge base
│   ├── about.aiml
│   ├── commissions.aiml
│   ├── contact.aiml
│   ├── core.aiml               # Greetings, small talk, out-of-scope deflection
│   ├── fallback.aiml           # Wildcard catch-all
│   ├── formwalk.aiml           # Commission form walk patterns
│   ├── heirloom.aiml           # Gated collection patterns
│   ├── labs.aiml
│   ├── lead.aiml               # Lead capture integration
│   ├── meta.aiml               # Bot identity questions
│   ├── navigation.aiml         # Page navigation patterns
│   ├── pricing.aiml
│   ├── revisions.aiml
│   └── royalties.aiml
├── engine/
│   ├── AimlEngine.ts           # Core engine: loads AIML, matches patterns, processes SRAI
│   ├── InputNormalizer.ts      # Contraction expansion + word-level synonym mapping
│   ├── ConversationContext.ts  # Per-session state and conversation history
│   ├── ResponseBuilder.ts      # Assembles EngineResponse from parsed template
│   ├── FormWalkEngine.ts       # Guided commission inquiry flow
│   └── KnowledgeLoader.ts      # JSON knowledge file loader
└── knowledge/                  # Supplementary knowledge JSON files
    ├── about.json
    ├── commissions.json
    ├── contact.json
    ├── heirloom.json
    ├── labs.json
    ├── navigation.json
    ├── pricing.json
    ├── revisions.json
    └── royalties.json
```

### AimlEngine

**`chatbot/engine/AimlEngine.ts`**

Parses all `.aiml` files at startup. `fallback.aiml` is always loaded last so wildcard patterns have the lowest priority. Each `<category>` becomes an `AimlRule` with a compiled `RegExp` for `*` wildcard expansion.

Pattern matching runs against normalized input in rule-load order (first match wins). The engine exposes:

- `process(message, context) → EngineResponse`
- `startFormWalk(context) → EngineResponse`
- `stepFormWalk(message, context) → EngineResponse`

**SRAI Resolution**

AIML's `<srai>` element redirects one pattern to another (e.g. many phrasings redirect to a single canonical answer). The engine resolves SRAI chains recursively up to depth 8 via `resolveSrai()`, preventing infinite loops. Without this, SRAI targets would echo back as literal text.

### InputNormalizer

**`chatbot/engine/InputNormalizer.ts`**

Before pattern matching, input is uppercased, punctuation-stripped, and passed through:

1. **Contraction expansion** — "don't" → "do not", "what's" → "what is", etc.
2. **Word-level synonym mapping** — ~30 replacements applied with word-boundary regex:
   - tune / track / piece / ditty / composition / melody → **song**
   - fee / fees / rate / rates / expense → **cost**
   - edit / modification → **revision**
   - timeline / timeframe → **turnaround**
   - order / purchase → **commission**

This dramatically widens pattern coverage without requiring duplicate AIML entries.

### FormWalkEngine

**`chatbot/engine/FormWalkEngine.ts`**

A guided multi-step flow that collects commission details (name, occasion, deadline, genre, story notes). Activated by pressing "Start My Commission" in the chat panel or by AIML pattern `__FORM_WALK__`. On completion it captures a lead and fires an email via the leads API.

### Response Format

`EngineResponse` fields:

```typescript
{
  text: string;              // Response copy
  navigationCard?: {         // Optional page link card
    label: string;
    href: string;
  };
  leadCapture?: boolean;     // Triggers email capture UI
  quickReplies?: string[];   // Suggested follow-up chips
  isFallback?: boolean;      // True when wildcard matched
  matchedPattern?: string;   // Which AIML pattern fired
}
```

### API Route

**`src/app/api/chat/route.ts`** — POST handler. Maintains an in-process `Map<sessionId, ConversationContext>` (sessions reset on cold start). Logs every exchange to Upstash Redis and appends to `chatbot/logs/` JSONL files (write fails silently in serverless; Redis is the durable store).

---

## BNSignal Analytics

The admin dashboard at `/admin/analytics` is a server-rendered analytics suite built on top of the Upstash Redis data store.

### Data Collection

**Page views** — `PageViewTracker` is a client component mounted in the root layout. It fires `POST /api/track` on each pathname change. Both the client component and the server route exclude `/admin` and `/api` paths to prevent self-pollution.

**Conversations** — every chatbot exchange is written to Redis via `kvTrackConversation`. Fallback responses are also written to a dedicated `bns:fallbacks` list.

### Redis Keys

| Key | Type | Contents |
|---|---|---|
| `bns:pageviews` | List (max 5,000) | `{ ts, path, sessionId, referrer? }` |
| `bns:conversations` | List (max 5,000) | `{ ts, sessionId, userMsg, botResponse, isFallback, pageContext, matchedPattern? }` |
| `bns:fallbacks` | List (max 5,000) | `{ ts, sessionId, userMsg, pageContext }` |

All lists use `lpush` + `ltrim` — newest entries first, hard-capped at 5,000 rows.

### Dashboard Pages

| Route | What it shows |
|---|---|
| `/admin/analytics` | Stat cards (total conversations, fallback rate, leads), daily conversation line chart, top AIML patterns, recent fallbacks |
| `/admin/analytics/website` | Page view stats, daily traffic chart, top pages bar chart (admin/api paths filtered) |
| `/admin/analytics/concierge` | Detailed pattern hit analysis; add-pattern shortcut |
| `/admin/analytics/journey` | Per-session navigation path viewer |
| `/admin/analytics/raw` | Raw JSONL log entries |

### Auth

`src/middleware.ts` protects all `/admin/*` routes with HTTP Basic Auth. Credentials are read from `ADMIN_USER` and `ADMIN_PASS` environment variables. Must live in `src/middleware.ts` (not project root) for Next.js projects using the `src/` directory layout.

---

## Automated Concierge Feedback Loop

The full cycle runs end-to-end without manual intervention after a one-time approval step.

```
Visitor asks unmatched question
         ↓
  Logged to Redis (bns:fallbacks)
         ↓
  Vercel Cron fires every 48 hours
  (POST /api/cron/analyze-fallbacks)
         ↓
  Claude Haiku analyzes fallbacks
  → AIML fix document (GitHub Issue, label: concierge-fix)
  → Journal post suggestions (GitHub Issue, label: journal-topics)
         ↓
  Redis fallbacks cleared (kvClearFallbacks)
         ↓
  Shane reviews concierge-fix issue
  Adds "approved" label
         ↓
  GitHub Action: implement-concierge-fix.yml
  → Installs Claude Code CLI
  → Runs claude --print with AIML implementation instructions
  → Claude reads fix document, appends patterns to correct .aiml files
  → Commits + pushes to main
  → Comments ✅ and closes issue
         ↓
  Vercel auto-deploys (~90 seconds)
  New patterns are live
```

### Cron Route

**`src/app/api/cron/analyze-fallbacks/route.ts`**

Protected by `CRON_SECRET` Bearer token (sent by Vercel). At each firing:

1. Reads `bns:fallbacks`, `bns:pageviews`, `bns:conversations` from Redis in parallel
2. Deduplicates fallbacks by normalized text, counts occurrences
3. If ≥ 3 unique fallback questions exist, calls Claude Haiku to generate an AIML fix document
4. Always calls Claude Haiku for journal post topic suggestions (based on page engagement + fallback themes)
5. Creates both GitHub Issues in parallel via the GitHub REST API
6. Clears `bns:fallbacks` with `kvClearFallbacks`

**Schedule** (`vercel.json`):
```json
{
  "crons": [{ "path": "/api/cron/analyze-fallbacks", "schedule": "0 10 */2 * *" }]
}
```

### GitHub Actions

**`.github/workflows/implement-concierge-fix.yml`**

Triggers on `issues: [labeled]`. Conditions:
- Label added = `approved`
- Issue also carries `concierge-fix`

Steps: checkout `main` → install Claude Code CLI → run `claude --print` with the fix document and AIML editing instructions → commit → push → comment + close issue. Failure leaves the issue open with a link to the Actions log for retry.

**`.github/workflows/setup-labels.yml`**

One-time `workflow_dispatch` job. Creates or updates the three required labels:

| Label | Color | Purpose |
|---|---|---|
| `concierge-fix` | `#C9921A` (gold) | Marks auto-generated AIML fix documents |
| `approved` | `#0E8A16` (green) | Triggers automatic implementation |
| `journal-topics` | `#0075CA` (blue) | Marks auto-generated journal suggestions |

Run once from the Actions tab before using the approval workflow.

---

## Environment Variables

### Vercel (Production)

| Variable | Required | Description |
|---|---|---|
| `UPSTASH_REDIS_REST_URL` | Yes | Upstash Redis REST endpoint |
| `UPSTASH_REDIS_REST_TOKEN` | Yes | Upstash Redis REST token |
| `ADMIN_USER` | Yes | BNSignal dashboard username |
| `ADMIN_PASS` | Yes | BNSignal dashboard password |
| `CRON_SECRET` | Yes | Bearer token Vercel sends with cron requests |
| `ANTHROPIC_API_KEY` | Yes | Claude Haiku API key (cron analysis) |
| `GITHUB_TOKEN` | Yes | GitHub PAT with `repo` scope (creates issues) |
| `RESEND_API_KEY` | Yes | Resend API key (lead capture emails) |

### GitHub Actions Secrets

| Secret | Description |
|---|---|
| `ANTHROPIC_API_KEY` | Claude Code CLI key (implement-concierge-fix workflow) |

---

## Admin Dashboard Setup

1. Create an Upstash Redis database at [console.upstash.com](https://console.upstash.com)
2. Copy the REST URL and token to Vercel environment variables
3. Set `ADMIN_USER` and `ADMIN_PASS` in Vercel
4. Run the `Setup Labels` GitHub Action once (Actions tab → Setup Labels → Run workflow)
5. Add `ANTHROPIC_API_KEY` and `GITHUB_TOKEN` to Vercel for the cron to function
6. Add `ANTHROPIC_API_KEY` to GitHub repository secrets for the implementation workflow

---

## Local Development

```bash
npm install
cp .env.local.example .env.local   # fill in credentials
npm run dev                         # http://localhost:3000
```

Type-check:
```bash
npx tsc --noEmit
```

The analytics dashboard and Redis-backed features work locally only when `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` are set. The chatbot and music player work fully offline.

---

## Repository Structure

```
src/
├── app/
│   ├── layout.tsx                    # Root layout: fonts, Navbar, Footer, PlayerProvider
│   ├── page.tsx                      # Home
│   ├── globals.css
│   ├── services/page.tsx
│   ├── music/page.tsx
│   ├── about/page.tsx
│   ├── contact/page.tsx
│   ├── blog/
│   │   ├── page.tsx
│   │   └── [slug]/page.tsx
│   ├── labs/page.tsx
│   ├── method/page.tsx
│   ├── heirloom/page.tsx             # Gated (ENABLE_HEIRLOOM_KB: false)
│   ├── admin/
│   │   ├── layout.tsx                # Admin shell + AdminNav
│   │   └── analytics/
│   │       ├── page.tsx              # Overview
│   │       ├── website/page.tsx
│   │       ├── concierge/
│   │       │   ├── page.tsx
│   │       │   └── add-pattern/page.tsx
│   │       ├── journey/page.tsx
│   │       └── raw/page.tsx
│   └── api/
│       ├── chat/route.ts             # Chatbot POST handler
│       ├── track/route.ts            # Page view tracker POST
│       ├── leads/route.ts            # Lead capture + email
│       ├── analytics/                # Analytics API routes
│       │   ├── overview/
│       │   ├── concierge/
│       │   ├── sessions/
│       │   ├── patterns/
│       │   └── export/
│       └── cron/
│           └── analyze-fallbacks/route.ts
├── components/
│   ├── layout/                       # Navbar, Footer
│   ├── home/                         # HeroSection, ServiceCards, FeaturedMusic,
│   │                                 # AboutSnippet, TestimonialsSection, StatsStrip
│   ├── music/                        # TrackCard, TrackListClient, PlaylistPlayer,
│   │                                 # PlayerProvider, LabVisualizer
│   ├── services/                     # ProcessSteps
│   ├── contact/                      # ContactForm, InquiryForm, DeliveryDatePicker
│   ├── chatbot/                      # AtelierConcierge, ChatPanel, ChatBubble,
│   │                                 # ChatMessage, NavigationCard, TypingIndicator,
│   │                                 # LeadCapture
│   ├── analytics/                    # StatCard, DailyLineChart, PageBarChart,
│   │                                 # PatternTable, FallbackTable, AdminNav,
│   │                                 # PageViewTracker
│   ├── labs/                         # LabsBarChart
│   ├── method/                       # MethodPageClient
│   └── ui/                           # Button, SectionHeading, GoldDivider,
│                                     # FloatingParticles, ScoreCircuitBackground,
│                                     # CustomCursor, WelcomeOverlay, SamCartModal,
│                                     # ReplaySequenceButton
├── hooks/
│   └── usePlaylist.ts                # Audio context: queue, playerState, controls
├── lib/
│   ├── utils.ts                      # cn() (clsx + tailwind-merge)
│   └── analytics/
│       ├── kv.ts                     # Upstash Redis read/write helpers
│       ├── aggregator.ts             # Stat aggregation from raw KV data
│       ├── readLogs.ts               # JSONL log file reader
│       ├── types.ts                  # Analytics interfaces
│       └── vercel.ts                 # Vercel analytics helper
├── middleware.ts                     # HTTP Basic Auth for /admin/* routes
└── types/index.ts                    # Song, ServiceTier, Testimonial interfaces
chatbot/                              # (see Atelier Concierge section above)
src/data/
├── songs.json                        # Primary song catalog — edit to add tracks
├── services.json
└── testimonials.json
.github/
├── workflows/
│   ├── implement-concierge-fix.yml   # Auto-implements approved AIML fixes
│   └── setup-labels.yml              # One-time label setup (run manually)
vercel.json                           # Cron schedule
```
