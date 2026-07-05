import type { Metadata } from "next";
import ClientIdForm from "./ClientIdForm";

export const metadata: Metadata = {
  title: "Track Your Commission | Brass Note Studios",
  description: "Enter your Client ID to view the progress of your custom song commission.",
  robots: { index: false, follow: false },
};

export default function ClientEntryPage() {
  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center px-6 py-16">
      <div className="w-full max-w-md space-y-8">
        {/* Wordmark */}
        <div className="text-center space-y-4">
          <p className="font-display text-gold text-sm tracking-[0.25em] uppercase">
            Brass Note Studios
          </p>

          {/* Gold divider */}
          <div className="flex items-center gap-4">
            <div className="h-px flex-1 bg-gold/20" />
            <div className="w-1.5 h-1.5 rotate-45 bg-gold/40" />
            <div className="h-px flex-1 bg-gold/20" />
          </div>
        </div>

        {/* Heading */}
        <div className="text-center space-y-3">
          <h1 className="font-display font-semibold text-3xl text-text-base leading-tight">
            Track Your Commission
          </h1>
          <p className="font-body font-light text-text-muted text-base leading-relaxed">
            Enter your Client ID to view your song&rsquo;s progress.
          </p>
        </div>

        {/* Form */}
        <ClientIdForm />

        {/* Footer note */}
        <p className="text-center font-body text-text-subtle text-xs leading-relaxed">
          Your Client ID was included in your commission confirmation email.
          <br />
          If you can&rsquo;t find it,{" "}
          <a
            href="/contact"
            className="text-gold/60 hover:text-gold transition-colors underline underline-offset-2"
          >
            contact the studio
          </a>
          .
        </p>
      </div>
    </main>
  );
}
