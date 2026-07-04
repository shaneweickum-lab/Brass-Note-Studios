import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Add Pattern" };

export default function AddPatternPage() {
  return (
    <div className="max-w-2xl flex flex-col gap-8">
      <div>
        <Link
          href="/admin/analytics/concierge"
          className="text-text-subtle font-body text-xs hover:text-text-muted transition-colors mb-6 inline-block"
        >
          ← Back to Concierge
        </Link>
        <h1 className="font-display text-3xl text-text-base mb-1">Add Pattern</h1>
        <p className="text-text-subtle font-body text-sm">
          Use the unanswered questions log to identify gaps, then add new AIML patterns to the chatbot.
        </p>
      </div>

      <div className="rounded-lg border border-white/10 bg-surface p-6 flex flex-col gap-4">
        <h2 className="font-display text-lg text-text-base">How to Add a Pattern</h2>
        <ol className="flex flex-col gap-3 font-body text-sm text-text-muted">
          <li className="flex gap-3">
            <span className="text-gold font-semibold shrink-0">1.</span>
            <span>
              Open the appropriate AIML file in{" "}
              <code className="text-gold font-mono text-xs">chatbot/aiml/</code>.
              Use an existing category file if it fits (e.g. <code className="text-gold font-mono text-xs">pricing.aiml</code>,
              {" "}<code className="text-gold font-mono text-xs">process.aiml</code>) or create a new one.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="text-gold font-semibold shrink-0">2.</span>
            <span>
              Add a new{" "}
              <code className="text-gold font-mono text-xs">&lt;category&gt;</code> block with a
              {" "}<code className="text-gold font-mono text-xs">&lt;pattern&gt;</code> (uppercase, no punctuation)
              and a <code className="text-gold font-mono text-xs">&lt;template&gt;</code> with the response.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="text-gold font-semibold shrink-0">3.</span>
            <span>
              Add wildcard variants:{" "}
              <code className="text-gold font-mono text-xs">* YOUR PATTERN *</code>,{" "}
              <code className="text-gold font-mono text-xs">* YOUR PATTERN</code>,{" "}
              <code className="text-gold font-mono text-xs">YOUR PATTERN *</code> to catch natural phrasing.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="text-gold font-semibold shrink-0">4.</span>
            <span>
              Commit and push. The engine reloads on next cold start.
            </span>
          </li>
        </ol>
      </div>

      <div className="rounded-lg border border-gold/30 bg-gold/5 p-5">
        <h3 className="font-display text-base text-gold mb-2">Pattern Template</h3>
        <pre className="font-mono text-xs text-text-muted overflow-x-auto leading-relaxed">{`<category>
  <pattern>YOUR PATTERN HERE</pattern>
  <template>Your response here.
    <quick-replies>
      <reply>Commission a song</reply>
      <reply>View pricing</reply>
    </quick-replies>
  </template>
</category>

<category>
  <pattern>* YOUR PATTERN HERE *</pattern>
  <template><srai>YOUR PATTERN HERE</srai></template>
</category>

<category>
  <pattern>* YOUR PATTERN HERE</pattern>
  <template><srai>YOUR PATTERN HERE</srai></template>
</category>

<category>
  <pattern>YOUR PATTERN HERE *</pattern>
  <template><srai>YOUR PATTERN HERE</srai></template>
</category>`}</pre>
      </div>
    </div>
  );
}
