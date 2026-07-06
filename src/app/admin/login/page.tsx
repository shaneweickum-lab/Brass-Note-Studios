import type { Metadata } from "next";
import { Suspense } from "react";
import LoginForm from "@/components/admin/LoginForm";

export const metadata: Metadata = {
  title: "Admin Portal — Brass Note Studios",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm space-y-8">

        {/* Wordmark */}
        <div className="text-center space-y-4">
          <p className="font-display text-gold text-xs tracking-[0.3em] uppercase select-none">
            Brass Note Studios
          </p>

          <div className="flex items-center justify-center gap-3">
            <div className="h-px flex-1 bg-gold/20" />
            <div className="w-1.5 h-1.5 rotate-45 bg-gold/50" />
            <div className="h-px flex-1 bg-gold/20" />
          </div>

          <div className="space-y-1">
            <h1 className="font-display text-2xl text-text-base">
              Admin Portal
            </h1>
            <p className="font-body text-xs text-text-subtle tracking-wide">
              BNSignal — Studio Management
            </p>
          </div>
        </div>

        {/* Login card */}
        <div className="bg-surface border border-white/10 rounded-lg px-6 py-7">
          <Suspense fallback={null}>
            <LoginForm />
          </Suspense>
        </div>

        {/* Footer link */}
        <p className="text-center font-body text-[11px] text-text-subtle/50">
          <a href="/" className="hover:text-text-subtle transition-colors">
            ← Back to site
          </a>
        </p>

      </div>
    </main>
  );
}
