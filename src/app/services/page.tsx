import type { Metadata } from "next";
import Link from "next/link";
import { Heart, Mic2, Music, CheckCircle } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import GoldDivider from "@/components/ui/GoldDivider";
import ProcessSteps from "@/components/services/ProcessSteps";
import servicesData from "@/data/services.json";
import type { ServiceFeature } from "@/types";

export const metadata: Metadata = {
  title: "Services — Custom Song Packages",
  description:
    "Choose from personal songs for life's milestones, professional theme music for brands, or comprehensive EP production. Every package includes original writing and professional production.",
};

const iconMap: Record<string, React.ElementType> = { Heart, Mic2, Music };

export default function ServicesPage() {
  const services = servicesData.services as ServiceFeature[];

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
            eyebrow="Services"
            title="What We Create Together"
            subtitle="Three service tiers built for different needs — all grounded in the same commitment to personal, professional songwriting and production."
          />
        </div>
      </section>

      <GoldDivider className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" />

      {/* Service tiers */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col gap-16">
          {services.map((service, i) => {
            const Icon = iconMap[service.icon] ?? Music;
            const isEven = i % 2 === 0;

            return (
              <div
                key={service.id}
                id={service.id}
                className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center scroll-mt-24"
              >
                {/* Icon/visual block */}
                <div className={`${isEven ? "lg:order-1" : "lg:order-2"}`}>
                  <div className="aspect-[4/3] rounded-2xl bg-surface border border-gold/10 flex flex-col items-center justify-center gap-4 p-10">
                    <div className="w-20 h-20 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center">
                      <Icon className="w-10 h-10 text-gold" />
                    </div>
                    <div className="text-center">
                      <p className="font-display text-2xl text-text-base">
                        {service.name}
                      </p>
                      <p className="text-gold text-sm italic mt-1">
                        {service.tagline}
                      </p>
                      <div className="mt-4 px-4 py-2 rounded-sm bg-gold/10 border border-gold/20 inline-block">
                        <p className="text-gold-light font-body font-semibold text-sm">
                          {service.priceLabel}
                        </p>
                        <p className="text-text-subtle text-xs mt-0.5">
                          {service.turnaround}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className={`${isEven ? "lg:order-2" : "lg:order-1"}`}>
                  <p className="text-gold font-body text-xs uppercase tracking-[0.2em] font-semibold mb-3">
                    {service.name}
                  </p>
                  <h2 className="font-display text-3xl md:text-4xl text-text-base mb-4 leading-tight">
                    {service.tagline}
                  </h2>
                  <p className="text-text-muted font-body leading-relaxed mb-6">
                    {service.description}
                  </p>

                  <ul className="flex flex-col gap-2.5 mb-6">
                    {service.features.map((feat) => (
                      <li key={feat} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-gold mt-0.5 shrink-0" />
                        <span className="text-text-muted font-body text-sm">
                          {feat}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <div className="flex flex-wrap gap-2 mb-8">
                    {service.examples.map((ex) => (
                      <span
                        key={ex}
                        className="text-xs px-3 py-1.5 rounded-full bg-gold/10 text-gold-light font-body border border-gold/10"
                      >
                        {ex}
                      </span>
                    ))}
                  </div>

                  <Link
                    href={`/contact?service=${encodeURIComponent(service.name)}`}
                    className="inline-flex items-center justify-center font-body font-semibold tracking-wide bg-gold text-background hover:bg-gold-light rounded-sm px-6 py-3 text-base transition-colors duration-200"
                  >
                    {service.ctaLabel}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <GoldDivider className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" />

      <ProcessSteps />

      {/* Bottom CTA */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-display text-4xl text-text-base mb-4">
            Not sure which tier fits?
          </h2>
          <p className="text-text-muted font-body leading-relaxed mb-8">
            Reach out and describe your project. I'll help you figure out the
            right approach and give you an honest recommendation.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center font-body font-semibold tracking-wide bg-gold text-background hover:bg-gold-light rounded-sm px-8 py-4 text-lg transition-colors duration-200"
          >
            Let&rsquo;s Talk
          </Link>
        </div>
      </section>
    </div>
  );
}
