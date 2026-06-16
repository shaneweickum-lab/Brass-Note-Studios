import SectionHeading from "@/components/ui/SectionHeading";
import { Star } from "lucide-react";
import type { Testimonial } from "@/types";

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
}

export default function TestimonialsSection({
  testimonials,
}: TestimonialsSectionProps) {
  return (
    <section className="py-24 lg:py-32 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <SectionHeading
            eyebrow="Testimonials"
            title="What Clients Say"
            centered
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="bg-surface rounded-lg p-8 border border-white/5 relative"
            >
              {/* Decorative quote mark */}
              <span
                className="absolute top-4 right-6 font-display text-7xl text-gold/10 leading-none pointer-events-none select-none"
                aria-hidden
              >
                &ldquo;
              </span>

              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 text-gold fill-gold"
                    aria-hidden
                  />
                ))}
              </div>

              <blockquote className="text-text-base font-body leading-relaxed mb-6 relative z-10">
                &ldquo;{t.quote}&rdquo;
              </blockquote>

              <div className="border-t border-white/5 pt-4">
                <p className="font-body font-semibold text-text-base text-sm">
                  {t.clientName}
                </p>
                {t.clientTitle && (
                  <p className="text-gold text-xs mt-0.5 italic">
                    {t.clientTitle}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
