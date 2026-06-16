import Link from "next/link";
import { Heart, Mic2, Music, ArrowRight } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import type { ServiceFeature } from "@/types";

const iconMap: Record<string, React.ElementType> = {
  Heart,
  Mic2,
  Music,
};

interface ServiceCardsProps {
  services: ServiceFeature[];
}

export default function ServiceCards({ services }: ServiceCardsProps) {
  return (
    <section className="py-24 lg:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <SectionHeading
          eyebrow="What We Offer"
          title="Songs for Every Occasion"
          subtitle="From personal milestones to brand anthems, I bring the music you've been imagining to life."
          centered
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {services.map((service) => {
          const Icon = iconMap[service.icon] ?? Music;
          return (
            <div
              key={service.id}
              className="group relative bg-surface rounded-lg p-8 border border-white/5 hover:border-gold/25 transition-all duration-300 flex flex-col"
            >
              {/* Gold accent top bar */}
              <div className="absolute top-0 left-8 right-8 h-px bg-gold-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="w-12 h-12 rounded-lg bg-gold/10 flex items-center justify-center mb-5">
                <Icon className="w-6 h-6 text-gold" />
              </div>

              <h3 className="font-display text-xl text-text-base mb-1">
                {service.name}
              </h3>
              <p className="text-gold text-sm font-body mb-4">
                {service.tagline}
              </p>
              <p className="text-text-muted text-sm leading-relaxed flex-1">
                {service.description.slice(0, 120)}…
              </p>

              <div className="mt-6 pt-6 border-t border-white/5 flex items-center justify-between">
                <span className="text-gold-light font-body text-sm font-semibold">
                  {service.priceLabel}
                </span>
                <Link
                  href={`/services#${service.id}`}
                  className="flex items-center gap-1 text-text-muted hover:text-gold text-sm font-body transition-colors group/link"
                >
                  Learn more{" "}
                  <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
