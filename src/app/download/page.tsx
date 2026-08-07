import { Suspense } from "react";
import DownloadClient from "./DownloadClient";

export const metadata = {
  title: "Download Your Track — Brass Note Studios",
  description: "Thank you for your purchase. Download your personal-use MP3.",
};

export default function DownloadPage() {
  return (
    <Suspense fallback={<DownloadShell />}>
      <DownloadClient />
    </Suspense>
  );
}

function DownloadShell() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="w-16 h-16 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center mx-auto mb-6">
          <span className="text-gold text-2xl">✦</span>
        </div>
        <p className="text-text-muted font-body text-sm">Verifying your purchase…</p>
      </div>
    </main>
  );
}
