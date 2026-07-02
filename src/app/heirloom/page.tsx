import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Package, Disc3, Usb, Star, Frame, Layers } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import GoldDivider from "@/components/ui/GoldDivider";

export const metadata: Metadata = {
  title: "The Heirloom Collection — Physical Keepsakes for Commissioned Music",
  description:
    "Brass Note Studios presents the Heirloom Collection — a curated series of physical objects crafted to preserve your commissioned music as a permanent, tangible treasure.",
};

const collectorContents = [
  {
    icon: Disc3,
    label: "45 RPM Vinyl Record",
    detail: "Your song(s) pressed onto a playable 45 vinyl — the warmth of analog, forever.",
  },
  {
    icon: Usb,
    label: "Custom USB Drive",
    detail: "High-resolution audio files, complete lyrics, and bespoke album art — all included.",
  },
  {
    icon: Package,
    label: "Leatherette Presentation Box",
    detail: "Handsome matte black leatherette exterior with a signature electric teal felt interior.",
  },
];

const collectorSpecs = [
  { label: "Exterior", value: "Matte black leatherette" },
  { label: "Interior lining", value: "Electric teal felt" },
  { label: "Vinyl format", value: "45 RPM · 7-inch" },
  { label: "Audio quality", value: "Studio master files on USB" },
  { label: "Included media", value: "Songs · Lyrics · Album art" },
  { label: "Production", value: "Made to order · Every piece is unique" },
];

const plateContents = [
  {
    icon: Frame,
    label: "Framed Brass Plate",
    detail: "Solid brass plate set in a finished display frame — built to hang or stand.",
  },
  {
    icon: Layers,
    label: "Pressed Text",
    detail: "Your note, wedding vows, or song lyrics permanently impressed into the brass surface.",
  },
];

const plateSpecs = [
  { label: "Material", value: "Solid brass plate" },
  { label: "Finish", value: "Display frame included" },
  { label: "Content", value: "Vows · Lyrics · Personal note" },
  { label: "Process", value: "Pressed text impression" },
  { label: "Display", value: "Hang or stand" },
  { label: "Production", value: "Made to order · Every piece is unique" },
];

export default function HeirloomPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(0,180,180,0.06), transparent 65%), radial-gradient(ellipse 40% 30% at 80% 60%, rgba(201,168,76,0.05), transparent 60%)",
          }}
        />
        <div className="max-w-7xl mx-auto relative z-10">
          <SectionHeading
            eyebrow="Brass Note Studios"
            title="The Heirloom Collection"
            subtitle="Commissioned music, preserved forever. A curated series of physical objects — each one crafted to hold your song the way a jewel box holds a gem."
            centered
          />
        </div>
      </section>

      <GoldDivider className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" />

      {/* Product No. 01 — The Music Collector */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-16">
            <span className="h-px flex-1 bg-gold/15" />
            <p className="font-display-sc text-[10px] tracking-[0.4em] text-gold/60 uppercase whitespace-nowrap">
              No. 01 · Inaugural Edition
            </p>
            <span className="h-px flex-1 bg-gold/15" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
            {/* Image */}
            <div className="relative">
              <div className="relative rounded-lg overflow-hidden border border-gold/10 bg-surface aspect-[4/3]">
                <Image
                  src="/images/9E65F767-3E31-427A-AFCB-77DAC1169081.png"
                  alt="The Music Collector — Brass Note Studios Heirloom Collection"
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{ background: "linear-gradient(135deg, rgba(10,10,10,0.10) 0%, transparent 50%, rgba(10,10,10,0.20) 100%)" }}
                />
              </div>
              <div
                className="absolute -bottom-px left-8 right-8 h-[2px]"
                style={{ background: "linear-gradient(90deg, transparent, #00B4B4, transparent)" }}
              />
              <div className="absolute -bottom-4 -right-4 w-20 h-20 border-b-2 border-r-2 border-gold/20 rounded-br-lg pointer-events-none" />
            </div>

            {/* Details */}
            <div className="flex flex-col gap-8">
              <div>
                <p className="font-display-sc text-teal text-[10px] uppercase tracking-[0.35em] mb-3">
                  The Music Collector
                </p>
                <h2 className="font-display text-4xl md:text-5xl text-text-base leading-[1.1] mb-4">
                  Your Song,<br />
                  <span className="text-gold italic font-light">Held Forever.</span>
                </h2>
                <p className="text-text-muted font-body text-sm leading-relaxed">
                  A song commission from Brass Note Studios is already something rare. The Music Collector
                  transforms it into something you can hold — a physical object of enduring quality,
                  built to sit on a shelf, be passed down, and be opened again and again.
                </p>
              </div>

              <div>
                <p className="font-display-sc text-gold/60 text-[9px] uppercase tracking-[0.35em] mb-5">What's Inside</p>
                <div className="flex flex-col gap-5">
                  {collectorContents.map(({ icon: Icon, label, detail }) => (
                    <div key={label} className="flex gap-4">
                      <div className="w-8 h-8 rounded bg-teal/8 border border-teal/15 flex items-center justify-center shrink-0 mt-0.5">
                        <Icon className="w-3.5 h-3.5 text-teal" />
                      </div>
                      <div>
                        <p className="font-body font-semibold text-text-base text-sm mb-0.5">{label}</p>
                        <p className="font-body text-text-muted text-xs leading-relaxed">{detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-white/6 pt-6">
                <p className="font-display-sc text-gold/60 text-[9px] uppercase tracking-[0.35em] mb-4">Specifications</p>
                <dl className="grid grid-cols-2 gap-x-6 gap-y-3">
                  {collectorSpecs.map(({ label, value }) => (
                    <div key={label}>
                      <dt className="font-body text-[10px] uppercase tracking-[0.15em] text-text-subtle mb-0.5">{label}</dt>
                      <dd className="font-body text-sm text-text-base">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              <div className="border-t border-white/6 pt-6 flex items-baseline gap-3">
                <span className="font-display text-4xl text-gold">$499</span>
                <span className="font-body text-text-muted text-sm">· made to order</span>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <Link
                  href="/contact?service=Heirloom+Collection&package=The+Music+Collector"
                  className="btn-gold-glow inline-flex items-center justify-center font-body font-semibold tracking-wide bg-gold text-background hover:bg-gold-light rounded-sm px-8 py-4 text-sm transition-colors duration-200"
                >
                  Commission Yours
                </Link>
                <Link
                  href="/contact#questions"
                  className="inline-flex items-center justify-center font-body font-semibold tracking-wide border border-gold/40 text-gold hover:border-gold rounded-sm px-8 py-4 text-sm transition-colors duration-200"
                >
                  Ask a Question
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <GoldDivider className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" />

      {/* Product No. 02 — The Brass Verse */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-surface">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-16">
            <span className="h-px flex-1 bg-gold/15" />
            <p className="font-display-sc text-[10px] tracking-[0.4em] text-gold/60 uppercase whitespace-nowrap">
              No. 02
            </p>
            <span className="h-px flex-1 bg-gold/15" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
            {/* Details — left on this card for visual variety */}
            <div className="flex flex-col gap-8 lg:order-1">
              <div>
                <p className="font-display-sc text-gold text-[10px] uppercase tracking-[0.35em] mb-3">
                  The Brass Verse
                </p>
                <h2 className="font-display text-4xl md:text-5xl text-text-base leading-[1.1] mb-4">
                  Words That<br />
                  <span className="text-gold italic font-light">Last in Brass.</span>
                </h2>
                <p className="text-text-muted font-body text-sm leading-relaxed">
                  Some words deserve more than paper. The Brass Verse takes your wedding vows,
                  your song lyrics, or a personal note and presses them permanently into solid brass —
                  then frames them for display. A piece that belongs on the wall, not in a drawer.
                </p>
              </div>

              <div>
                <p className="font-display-sc text-gold/60 text-[9px] uppercase tracking-[0.35em] mb-5">What's Included</p>
                <div className="flex flex-col gap-5">
                  {plateContents.map(({ icon: Icon, label, detail }) => (
                    <div key={label} className="flex gap-4">
                      <div className="w-8 h-8 rounded bg-gold/8 border border-gold/15 flex items-center justify-center shrink-0 mt-0.5">
                        <Icon className="w-3.5 h-3.5 text-gold" />
                      </div>
                      <div>
                        <p className="font-body font-semibold text-text-base text-sm mb-0.5">{label}</p>
                        <p className="font-body text-text-muted text-xs leading-relaxed">{detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-white/6 pt-6">
                <p className="font-display-sc text-gold/60 text-[9px] uppercase tracking-[0.35em] mb-4">Specifications</p>
                <dl className="grid grid-cols-2 gap-x-6 gap-y-3">
                  {plateSpecs.map(({ label, value }) => (
                    <div key={label}>
                      <dt className="font-body text-[10px] uppercase tracking-[0.15em] text-text-subtle mb-0.5">{label}</dt>
                      <dd className="font-body text-sm text-text-base">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              <div className="border-t border-white/6 pt-6 flex items-baseline gap-3">
                <span className="font-display text-4xl text-gold">$249</span>
                <span className="font-body text-text-muted text-sm">· made to order</span>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <Link
                  href="/contact?service=Heirloom+Collection&package=The+Brass+Verse"
                  className="btn-gold-glow inline-flex items-center justify-center font-body font-semibold tracking-wide bg-gold text-background hover:bg-gold-light rounded-sm px-8 py-4 text-sm transition-colors duration-200"
                >
                  Commission Yours
                </Link>
                <Link
                  href="/contact#questions"
                  className="inline-flex items-center justify-center font-body font-semibold tracking-wide border border-gold/40 text-gold hover:border-gold rounded-sm px-8 py-4 text-sm transition-colors duration-200"
                >
                  Ask a Question
                </Link>
              </div>
            </div>

            {/* Image — right on this card */}
            <div className="relative lg:order-2">
              <div className="rounded-lg overflow-hidden border border-gold/10 bg-surface">
                <Image
                  src="/images/13F03C12-DB14-430C-8A8E-8550F84597C8.png"
                  alt="The Brass Verse — Brass Note Studios Heirloom Collection"
                  width={1536}
                  height={1024}
                  className="w-full h-auto object-cover"
                />
              </div>
              <div
                className="absolute -bottom-px left-8 right-8 h-[2px]"
                style={{ background: "linear-gradient(90deg, transparent, #C9A84C, transparent)" }}
              />
              <div className="absolute -bottom-4 -left-4 w-20 h-20 border-b-2 border-l-2 border-gold/20 rounded-bl-lg pointer-events-none" />
            </div>
          </div>
        </div>
      </section>

      <GoldDivider className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" />

      {/* The Collection Philosophy */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <SectionHeading
            eyebrow="The Collection"
            title="Made to Be Kept"
            centered
            className="mb-8"
          />
          <div className="flex flex-col gap-4 text-text-muted font-body text-sm leading-relaxed">
            <p>
              Music is ephemeral by nature — a stream that plays once and disappears.
              The Heirloom Collection exists to change that. Each piece is designed to give your
              commissioned music a permanent home: something tangible, something beautiful, something
              that will still mean something in thirty years.
            </p>
            <p>
              Every item in the collection is made to order. Nothing is mass-produced.
              Nothing is generic. Each piece is assembled specifically for your commission —
              your words, your story, your name.
            </p>
          </div>
        </div>
      </section>

      <GoldDivider className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" />

      {/* Coming soon */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-surface">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <SectionHeading
              eyebrow="Coming Soon"
              title="More Pieces. More Ways to Preserve."
              centered
            />
          </div>
          <div className="max-w-sm mx-auto">
            <div className="rounded-lg border border-white/5 bg-surface-elevated p-10 flex flex-col items-center justify-center gap-3 text-center min-h-[180px]">
              <Star className="w-5 h-5 text-gold/25" />
              <p className="font-display-sc text-[10px] uppercase tracking-[0.3em] text-text-subtle">No. 03</p>
              <p className="font-display text-lg text-text-subtle italic">In Development</p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-white/5 text-center">
        <div className="max-w-xl mx-auto">
          <h2 className="font-display text-3xl text-text-base mb-4">
            Ready to Commission a Piece?
          </h2>
          <p className="text-text-muted font-body text-sm mb-8 leading-relaxed">
            Each Heirloom piece can stand alone or accompany a song commission.
            Tell us what you have in mind — we handle everything from there.
          </p>
          <Link
            href="/contact?service=Heirloom+Collection"
            className="btn-gold-glow inline-flex items-center justify-center font-body font-semibold tracking-wide bg-gold text-background hover:bg-gold-light rounded-sm px-8 py-4 text-lg transition-colors duration-200"
          >
            Commission Yours
          </Link>
        </div>
      </section>
    </div>
  );
}
