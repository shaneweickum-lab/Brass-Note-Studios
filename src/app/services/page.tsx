import type { Metadata } from "next";
import Link from "next/link";
import { Heart, Mic2, Users, Music, Check, Clock, Star } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import GoldDivider from "@/components/ui/GoldDivider";
import ProcessSteps from "@/components/services/ProcessSteps";
import servicesData from "@/data/services.json";

export const metadata: Metadata = {
  title: "Services & Pricing",
  description:
    "Custom song commissions for individuals, organizations, and content creators. Transparent pricing, flexible packages, and subscription plans for ongoing music needs.",
};

const iconMap: Record<string, React.ElementType> = { Heart, Mic2, Users, Music };

export default function ServicesPage() {
  const { categories, subscriptions, addons } = servicesData;

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
            eyebrow="Services & Pricing"
            title="Transparent Pricing. Personal Craft."
            subtitle="Every song is built from scratch — your story, your people, your occasion. With 30 years of musicianship and a ten-layer production framework, we translate real emotion into music that moves people."
            centered
          />
        </div>
      </section>

      <GoldDivider className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" />

      {/* Commission Categories */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex flex-col gap-20">
        {categories.map((cat) => {
          const Icon = iconMap[cat.icon] ?? Music;
          return (
            <section key={cat.id} id={cat.id} className="scroll-mt-24">
              {/* Category header */}
              <div className="flex flex-col sm:flex-row sm:items-start gap-4 mb-8">
                <div className="w-12 h-12 rounded-lg bg-gold/10 flex items-center justify-center shrink-0 mt-1">
                  <Icon className="w-6 h-6 text-gold" />
                </div>
                <div>
                  <p className="text-gold font-body text-xs uppercase tracking-[0.2em] font-semibold mb-1">
                    {cat.name}
                  </p>
                  <h2 className="font-display text-2xl md:text-3xl text-text-base mb-3">
                    {cat.tagline}
                  </h2>
                  <p className="text-text-muted font-body text-sm leading-relaxed max-w-2xl">
                    {cat.description}
                  </p>
                </div>
              </div>

              {/* Pricing table */}
              <div className="rounded-lg border border-white/8 overflow-hidden">
                {/* Table header */}
                <div className="grid grid-cols-[1fr_auto_1fr] bg-surface-elevated px-6 py-3 border-b border-white/8">
                  <span className="text-gold font-body text-xs uppercase tracking-[0.15em] font-semibold">Package</span>
                  <span className="text-gold font-body text-xs uppercase tracking-[0.15em] font-semibold text-center px-8">Price</span>
                  <span className="text-gold font-body text-xs uppercase tracking-[0.15em] font-semibold">What You Get</span>
                </div>
                {/* Rows */}
                {cat.packages.map((pkg, i) => (
                  <div
                    key={pkg.name}
                    className={`grid grid-cols-[1fr_auto_1fr] items-center px-6 py-4 border-b border-white/5 last:border-0 transition-colors hover:bg-gold/5 ${
                      i % 2 === 0 ? "bg-surface" : "bg-surface/60"
                    }`}
                  >
                    <span className="font-body font-semibold text-text-base text-sm">
                      {pkg.name}
                    </span>
                    <span className="font-display text-gold text-xl px-8 text-center whitespace-nowrap">
                      {pkg.price}
                    </span>
                    <span className="text-text-muted font-body text-sm leading-relaxed">
                      {pkg.description}
                    </span>
                  </div>
                ))}
              </div>

              {/* Included note + delivery */}
              <div className="mt-4 flex flex-col sm:flex-row gap-4 sm:gap-8">
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-gold mt-0.5 shrink-0" />
                  <p className="text-text-muted font-body text-sm">{cat.included}</p>
                </div>
                <div className="flex items-start gap-2">
                  <Clock className="w-4 h-4 text-gold mt-0.5 shrink-0" />
                  <p className="text-text-muted font-body text-sm">{cat.delivery}</p>
                </div>
              </div>

              <div className="mt-6">
                <Link
                  href={`/contact?service=${encodeURIComponent(cat.name)}`}
                  className="inline-flex items-center justify-center font-body font-semibold tracking-wide bg-gold text-background hover:bg-gold-light rounded-sm px-6 py-3 text-sm transition-colors duration-200"
                >
                  Order a {cat.name.split(" ")[0]} Commission
                </Link>
              </div>
            </section>
          );
        })}
      </div>

      <GoldDivider className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" />

      {/* Subscription Plans */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-surface" id="subscriptions">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10">
            <SectionHeading
              eyebrow="Subscription Plans"
              title="Consistent Music. Best Value."
              subtitle={subscriptions.description}
            />
          </div>

          {/* Subscription table */}
          <div className="rounded-lg border border-white/8 overflow-x-auto mb-8">
            <table className="w-full min-w-[640px]">
              <thead>
                <tr className="bg-surface-elevated border-b border-white/8">
                  <th className="text-left text-gold font-body text-xs uppercase tracking-[0.15em] font-semibold px-6 py-3">Plan</th>
                  <th className="text-center text-gold font-body text-xs uppercase tracking-[0.15em] font-semibold px-6 py-3">Monthly</th>
                  <th className="text-center text-gold font-body text-xs uppercase tracking-[0.15em] font-semibold px-6 py-3">Annual</th>
                  <th className="text-left text-gold font-body text-xs uppercase tracking-[0.15em] font-semibold px-6 py-3">What&apos;s Included</th>
                </tr>
              </thead>
              <tbody>
                {subscriptions.tiers.map((tier, i) => (
                  <tr
                    key={tier.name}
                    className={`border-b border-white/5 last:border-0 hover:bg-gold/5 transition-colors ${
                      i % 2 === 0 ? "bg-surface" : "bg-surface/60"
                    }`}
                  >
                    <td className="px-6 py-4 font-body font-semibold text-text-base text-sm whitespace-nowrap">
                      {tier.name}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="font-display text-gold text-lg">{tier.monthly}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="font-display text-gold-light text-lg">{tier.annual}</span>
                    </td>
                    <td className="px-6 py-4 text-text-muted font-body text-sm leading-relaxed">
                      {tier.included}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Why subscribe */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-display text-lg text-text-base mb-4 flex items-center gap-2">
                <Star className="w-5 h-5 text-gold" /> Why Subscribe?
              </h3>
              <ul className="flex flex-col gap-2.5">
                {subscriptions.perks.map((perk) => (
                  <li key={perk} className="flex items-start gap-3">
                    <Check className="w-4 h-4 text-gold mt-0.5 shrink-0" />
                    <span className="text-text-muted font-body text-sm leading-relaxed">{perk}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-surface-elevated rounded-lg p-6 border border-gold/10">
              <p className="text-text-muted font-body text-sm leading-relaxed mb-4">
                {subscriptions.note}
              </p>
              <Link
                href="/contact?service=Subscription"
                className="inline-flex items-center justify-center font-body font-semibold tracking-wide bg-gold text-background hover:bg-gold-light rounded-sm px-6 py-3 text-sm transition-colors duration-200"
              >
                Start a Subscription
              </Link>
            </div>
          </div>
        </div>
      </section>

      <GoldDivider className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" />

      {/* Add-Ons */}
      <section className="py-20 px-4 sm:px-6 lg:px-8" id="addons">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10">
            <SectionHeading
              eyebrow="Add-Ons"
              title="Enhance Any Order"
              subtitle="Pair any commission or subscription with these optional extras."
            />
          </div>

          <div className="rounded-lg border border-white/8 overflow-hidden">
            <div className="grid grid-cols-[1fr_auto_1fr] bg-surface-elevated px-6 py-3 border-b border-white/8">
              <span className="text-gold font-body text-xs uppercase tracking-[0.15em] font-semibold">Add-On</span>
              <span className="text-gold font-body text-xs uppercase tracking-[0.15em] font-semibold text-center px-8">Price</span>
              <span className="text-gold font-body text-xs uppercase tracking-[0.15em] font-semibold">Notes</span>
            </div>
            {addons.map((addon, i) => (
              <div
                key={addon.name}
                className={`grid grid-cols-[1fr_auto_1fr] items-center px-6 py-4 border-b border-white/5 last:border-0 hover:bg-gold/5 transition-colors ${
                  i % 2 === 0 ? "bg-surface" : "bg-surface/60"
                }`}
              >
                <span className="font-body font-semibold text-text-base text-sm">{addon.name}</span>
                <span className="font-display text-gold text-xl px-8 text-center">{addon.price}</span>
                <span className="text-text-muted font-body text-sm">{addon.notes}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <GoldDivider className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" />

      <ProcessSteps />

      {/* Bottom CTA */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 text-center bg-surface border-t border-white/5">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-display text-4xl text-text-base mb-4">
            Not Sure Which Package Fits?
          </h2>
          <p className="text-text-muted font-body leading-relaxed mb-8">
            Reach out and describe your project. I&apos;ll help you figure out the right approach and give you an honest recommendation.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center font-body font-semibold tracking-wide bg-gold text-background hover:bg-gold-light rounded-sm px-8 py-4 text-lg transition-colors duration-200"
          >
            Let&apos;s Talk
          </Link>
        </div>
      </section>
    </div>
  );
}
