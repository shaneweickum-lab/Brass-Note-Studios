import type { Metadata } from "next";
import { headers, cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import AdminNav from "@/components/analytics/AdminNav";
import AdminBottomNav from "@/components/analytics/AdminBottomNav";
import PwaRegister from "@/components/analytics/PwaRegister";
import LogoutButton from "@/components/admin/LogoutButton";
import { ADMIN_COOKIE } from "@/lib/adminSession";

export const metadata: Metadata = {
  title: { default: "BNSignal", template: "%s | BNSignal" },
  robots: { index: false, follow: false },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    title: "BNS Admin",
    statusBarStyle: "black-translucent",
  },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = (await headers()).get("x-pathname") ?? "";
  const isLoginPage = pathname === "/admin/login";

  async function logout() {
    "use server";
    (await cookies()).delete(ADMIN_COOKIE);
    redirect("/admin/login");
  }

  // Login page: no nav shell — just render children (full-screen login UI)
  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Sticky header — safe-area-inset-top so content clears the notch in standalone PWA */}
      <header
        className="sticky top-0 z-50 border-b border-white/10 bg-background/95 backdrop-blur"
        style={{ paddingTop: "env(safe-area-inset-top)" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">

          {/* Mobile: single compact row — nav lives in bottom tab bar */}
          <div className="flex items-center justify-between py-3 sm:hidden">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
              <span className="font-display text-gold text-sm tracking-[0.25em] uppercase select-none">
                BNSignal
              </span>
            </div>
            <LogoutButton onLogout={logout} />
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
            <div className="ml-auto flex items-center gap-4 shrink-0">
              <Link
                href="/"
                className="text-text-subtle font-body text-xs hover:text-text-muted transition-colors"
              >
                ← Back to site
              </Link>
              <div className="w-px h-3 bg-white/15" />
              <LogoutButton onLogout={logout} />
            </div>
          </div>

        </div>
      </header>

      {/* Content — extra bottom padding on mobile to clear the fixed bottom nav */}
      <main
        className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10"
        style={{ paddingBottom: "calc(4.5rem + env(safe-area-inset-bottom))" }}
      >
        {children}
      </main>

      {/* Fixed bottom tab bar — mobile only, desktop uses header nav */}
      <AdminBottomNav />

      <PwaRegister />
    </div>
  );
}
