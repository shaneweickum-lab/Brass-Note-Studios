import type { Metadata } from "next";
import { Clock, CheckCircle, MessageCircle } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import GoldDivider from "@/components/ui/GoldDivider";
import ContactFormWrapper from "./ContactFormWrapper";
import InquiryForm from "@/components/contact/InquiryForm";

export const metadata: Metadata = {
  title: "Commission a Song",
  description:
    "Share your story and let the atelier begin. Every Brass Note Studios commission starts here — your occasion, your package, your song. We respond within one business day.",
  keywords: [
    "commission a song",
    "order a custom song",
    "custom song request",
    "personalized song order",
    "bespoke song commission",
    "start a music commission",
    "custom song inquiry",
    "hire a songwriter",
  ],
  alternates: { canonical: "https://brassnotestudios.com/contact" },
  openGraph: {
    title: "Commission a Song | Brass Note Studios",
    description:
      "Share your story and let the atelier begin. Your occasion, your package, your song — we respond within one business day.",
    url: "https://brassnotestudios.com/contact",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Commission a Song | Brass Note Studios",
    description:
      "Share your story and let the atelier begin. Your occasion, your package, your song.",
  },
};

const expectations = [
  {
    icon: Clock,
    title: "Response in 1–2 Days",
    description:
      "We'll review your project details and reach out within 1–2 business days to discuss next steps.",
  },
  {
    icon: CheckCircle,
    title: "100% Custom",
    description:
      "Every song is written from scratch for your specific needs. No templates, no recycled lyrics.",
  },
];

export default function ContactPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(ellipse 60% 50% at 50% 0%, #C9921A33, transparent 70%)",
          }}
        />
        <div className="max-w-7xl mx-auto relative z-10">
          <SectionHeading
            eyebrow="Get Your Song"
            title="Let's Create Something"
            subtitle="Tell us about your project. The more detail you share, the better we can bring your vision to life."
            centered
          />
        </div>
      </section>

      <GoldDivider className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16" />

      {/* ── Intake Form ── */}
      <section className="pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-16">
            {/* Form */}
            <div className="lg:col-span-3">
              <ContactFormWrapper />
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-2 flex flex-col gap-8">
              <div>
                <h3 className="font-display text-xl text-text-base mb-6">What to Expect</h3>
                <div className="flex flex-col gap-6">
                  {expectations.map(({ icon: Icon, title, description }) => (
                    <div key={title} className="flex gap-4">
                      <div className="w-9 h-9 rounded-lg bg-gold/10 flex items-center justify-center shrink-0">
                        <Icon className="w-4 h-4 text-gold" />
                      </div>
                      <div>
                        <p className="font-body font-semibold text-text-base text-sm mb-1">{title}</p>
                        <p className="text-text-muted font-body text-sm leading-relaxed">{description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-surface rounded-lg p-6 border border-gold/10">
                <h4 className="font-display text-lg text-gold mb-3">Tips for Your Description</h4>
                <ul className="flex flex-col gap-2">
                  {[
                    "Who is this song for?",
                    "What's the occasion or purpose?",
                    "What mood or genre fits best?",
                    "Any specific memories or details to include?",
                    "How and where will you use the song?",
                  ].map((tip) => (
                    <li key={tip} className="text-text-muted text-sm font-body flex items-start gap-2">
                      <span className="text-gold mt-0.5">›</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <GoldDivider className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16" />

      {/* ── Inquiry Form ── */}
      <section id="questions" className="pb-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-16">

            {/* Left — context */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              <div>
                <p className="text-gold font-body text-xs uppercase tracking-[0.2em] font-semibold mb-3">
                  Not Ready to Dive In Yet?
                </p>
                <h2 className="font-display text-2xl md:text-3xl text-text-base leading-snug mb-4">
                  Have Questions First?
                </h2>
                <p className="text-text-muted font-body text-sm leading-relaxed">
                  Curious about how it works, what's possible, or whether this is the right fit?
                  Send us a question — no commitment, no pressure.
                </p>
              </div>

              {/* No Commitment card — moved here from sidebar */}
              <div className="bg-surface rounded-lg p-6 border border-white/8 flex gap-4">
                <div className="w-9 h-9 rounded-lg bg-gold/10 flex items-center justify-center shrink-0 mt-0.5">
                  <MessageCircle className="w-4 h-4 text-gold" />
                </div>
                <div>
                  <p className="font-body font-semibold text-text-base text-sm mb-1">No Commitment Required</p>
                  <p className="text-text-muted font-body text-sm leading-relaxed">
                    Reaching out doesn't lock you into anything. We'll talk through your project honestly before any payment is made — and if it's not the right fit, we'll tell you.
                  </p>
                </div>
              </div>

              <div className="bg-surface rounded-lg p-6 border border-gold/10">
                <h4 className="font-display text-base text-gold mb-3">Good things to ask us</h4>
                <ul className="flex flex-col gap-2">
                  {[
                    "How does the song creation process work?",
                    "Can I hear examples before I commit?",
                    "What if I don't love the first version?",
                    "How do royalties and licensing work?",
                    "Can you match a very specific sound?",
                  ].map((q) => (
                    <li key={q} className="text-text-muted text-sm font-body flex items-start gap-2">
                      <span className="text-gold mt-0.5">›</span>
                      {q}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right — inquiry form */}
            <div className="lg:col-span-3">
              <InquiryForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
