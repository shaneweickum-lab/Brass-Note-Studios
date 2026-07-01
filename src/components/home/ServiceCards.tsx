import Link from "next/link";
import { Heart, Mic2, Users, ArrowRight } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";

const cards = [
  {
    id: "individual",
    icon: Heart,
    name: "Individual Commissions",
    tagline: "Birthdays, Anniversaries, Weddings & More",
    description: "Custom songs for life's most meaningful moments — written from your story and produced for you alone.",
    startingAt: "From $149",
  },
  {
    id: "organization",
    icon: Users,
    name: "Organization Commissions",
    tagline: "Churches, Nonprofits, Schools & Businesses",
    description: "Original anthems built around your mission, community, and identity. Your sound. Completely unique.",
    startingAt: "From $199",
  },
  {
    id: "creator",
    icon: Mic2,
    name: "Content Creator Commissions",
    tagline: "YouTubers, Podcasters & Social Creators",
    description: "Original music at creator-friendly rates — music-only tracks or your words set to a full production.",
    startingAt: "From $149",
  },
];

export default function ServiceCards() {
  return (
    <section className="py-24 lg:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <SectionHeading
          eyebrow="A Dedicated Atelier"
          title="A New Era of Music"
          subtitle="We write, arrange, and produce original compositions — for personal milestones, brand identities, and organizations that understand the power of sound."
          centered
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 divide-x divide-border-subtle border border-border-subtle">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.id}
              className="group relative bg-background p-8 hover:bg-surface-elevated transition-all duration-500 flex flex-col border-t-2 border-t-transparent hover:border-t-gold"
            >
              <div className="w-9 h-9 border border-gold/20 flex items-center justify-center mb-6 group-hover:border-gold/45 transition-colors duration-300">
                <Icon className="w-4 h-4 text-gold/60 group-hover:text-gold transition-colors duration-300" />
              </div>

              <h3 className="font-display text-xl text-text-base mb-1 font-medium">
                {card.name}
              </h3>
              <p className="text-gold/60 text-[10px] font-body tracking-[0.2em] uppercase mb-4">
                {card.tagline}
              </p>
              <p className="text-text-muted text-sm leading-relaxed flex-1 font-body">
                {card.description}
              </p>

              <div className="mt-6 pt-5 border-t border-border-subtle flex items-center justify-between">
                <span className="text-gold font-display text-lg font-medium">
                  {card.startingAt}
                </span>
                <Link
                  href={`/services#${card.id}`}
                  className="flex items-center gap-1.5 text-text-muted/60 hover:text-gold text-[10px] font-body tracking-[0.18em] uppercase transition-colors group/link"
                >
                  See pricing{" "}
                  <ArrowRight className="w-3 h-3 group-hover/link:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
