import type { Metadata } from "next";
import Link from "next/link";
import AdminNav from "@/components/analytics/AdminNav";
import PwaRegister from "@/components/analytics/PwaRegister";

export const metadata: Metadata = {
  title: { default: "BNSignal", template: "%s | BNSignal" },
  robots: { index: false, follow: false },
  manifest: "/manifest.json",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-background/95 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">

          {/* Top row: wordmark + back link */}
          <div className="flex items-center justify-between py-2.5 sm:hidden">
            <div className="flex items-center gap-2">
              {/* Dot indicator */}
              <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
              <span className="font-display text-gold text-xs tracking-[0.25em] uppercase select-none">
                BNSignal
              </span>
            </div>
            <Link
              href="/"
              className="text-text-subtle font-body text-xs hover:text-text-muted transition-colors"
            >
              ← Site
            </Link>
          </div>

          {/* Mobile: nav strip on its own row */}
          <div className="pb-2 sm:hidden">
            <AdminNav />
          </div>

          {/* Desktop: everything on one row */}
          <div className="hidden sm:flex items-center gap-4 py-3">
            <div className="flex items-center gap-2 shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
              <span className="font-display text-gold text-sm tracking-[0.25em] uppercase select-none">
                BNSignal
              </span>
            </div>
            <div className="w-px h-4 bg-white/15 shrink-0" />
            <AdminNav />
            <Link
              href="/"
              className="ml-auto shrink-0 text-text-subtle font-body text-xs hover:text-text-muted transition-colors"
            >
              ← Back to site
            </Link>
          </div>

        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        {children}
      </main>
      <PwaRegister />
    </div>
  );
}
