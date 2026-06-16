import type { Metadata } from "next";
import { Clock, CheckCircle, MessageCircle } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import GoldDivider from "@/components/ui/GoldDivider";
import ContactFormWrapper from "./ContactFormWrapper";

export const metadata: Metadata = {
  title: "Get Your Song — Start Your Project",
  description:
    "Ready to commission a custom song? Tell us about your project and we'll get back to you within 1-2 business days.",
};

const expectations = [
  {
    icon: Clock,
    title: "Response in 1–2 Days",
    description:
      "I'll review your project details and reach out within 1-2 business days to discuss next steps.",
  },
  {
    icon: MessageCircle,
    title: "No Commitment Required",
    description:
      "Submitting this form doesn't lock you into anything. We'll talk through your project before any payment is made.",
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
            subtitle="Tell me about your project. The more detail you share, the better I can bring your vision to life."
          />
        </div>
      </section>

      <GoldDivider className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16" />

      {/* Content */}
      <section className="pb-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-16">
            {/* Form */}
            <div className="lg:col-span-3">
              <ContactFormWrapper />
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-2 flex flex-col gap-8">
              <div>
                <h3 className="font-display text-xl text-text-base mb-6">
                  What to Expect
                </h3>
                <div className="flex flex-col gap-6">
                  {expectations.map(({ icon: Icon, title, description }) => (
                    <div key={title} className="flex gap-4">
                      <div className="w-9 h-9 rounded-lg bg-gold/10 flex items-center justify-center shrink-0">
                        <Icon className="w-4 h-4 text-gold" />
                      </div>
                      <div>
                        <p className="font-body font-semibold text-text-base text-sm mb-1">
                          {title}
                        </p>
                        <p className="text-text-muted font-body text-sm leading-relaxed">
                          {description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-surface rounded-lg p-6 border border-gold/10">
                <h4 className="font-display text-lg text-gold mb-3">
                  Tips for Your Description
                </h4>
                <ul className="flex flex-col gap-2">
                  {[
                    "Who is this song for?",
                    "What's the occasion or purpose?",
                    "What mood or genre fits best?",
                    "Any specific memories or details to include?",
                    "How and where will you use the song?",
                  ].map((tip) => (
                    <li
                      key={tip}
                      className="text-text-muted text-sm font-body flex items-start gap-2"
                    >
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
    </div>
  );
}
