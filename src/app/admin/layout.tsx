import type { Metadata } from "next";
import AdminNav from "@/components/analytics/AdminNav";

export const metadata: Metadata = {
  title: { default: "BNSignal", template: "%s | BNSignal" },
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-background/95 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-6">
          <span className="font-display text-gold text-sm tracking-widest uppercase select-none">
            BNSignal
          </span>
          <AdminNav />
          <a
            href="/"
            className="ml-auto text-text-subtle font-body text-xs hover:text-text-muted transition-colors"
          >
            ← Back to site
          </a>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10">{children}</main>
    </div>
  );
}
