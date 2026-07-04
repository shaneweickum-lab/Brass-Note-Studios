import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Music2, Sparkles, Heart, Users, Award, Disc3, FlaskConical } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import GoldDivider from "@/components/ui/GoldDivider";

export const metadata: Metadata = {
  title: "About the Studio",
  description:
    "Brass Note Studios is a bespoke music atelier where craft, technology, and decades of musicianship converge — giving every story the original song it deserves.",
  keywords: [
    "about brass note studios",
    "bespoke music studio",
    "custom songwriting studio",
    "music atelier",
    "professional music production",
    "original music studio",
    "songwriting service",
  ],
  alternates: { canonical: "https://brassnotestudios.com/about" },
  openGraph: {
    title: "About the Studio | Brass Note Studios",
    description:
      "A bespoke music atelier where craft, technology, and decades of musicianship converge — giving every story the original song it deserves.",
    url: "https://brassnotestudios.com/about",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About the Studio | Brass Note Studios",
    description:
      "A bespoke music atelier where craft, technology, and decades of musicianship converge — giving every story the original song it deserves.",
  },
};

const values = [
  {
    icon: Heart,
    title: "Personal Investment",
    description:
      "Every song starts with a real conversation. We take time to understand the people, moments, and emotions behind your project before writing a single note.",
  },
  {
    icon: Sparkles,
    title: "Creative Quality",
    description:
      "We don't believe in generic music. Each song is written from scratch with your specific story in mind — because cookie-cutter content can't capture real moments.",
  },
  {
    icon: Users,
    title: "Collaborative Spirit",
    description:
      "Your vision guides the whole process. We work with you through revisions until the song feels exactly right — this is your music, and you should love it.",
  },
  {
    icon: Music2,
    title: "Modern Production",
    description:
      "Our production process is built on a proprietary framework developed through years of research and refinement — delivering recordings that sound like they came from a full production studio, every time.",
  },
];

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(ellipse 60% 50% at 50% 0%, #C9921A33, transparent 70%)",
          }}
        />
        <div className="max-w-7xl mx-auto relative z-10">
          <SectionHeading
            eyebrow="About Us"
            title="Where Your Story Becomes a Song"
            subtitle="Brass Note Studios was built on one belief: that music is one of the most powerful ways to honor the moments and people that matter most."
            centered
          />
        </div>
      </section>

      <GoldDivider className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" />

      {/* Story */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* Studio visual */}
            <div className="relative">
              <div className="aspect-square rounded-2xl border border-gold/10 flex flex-col items-center justify-center p-12 relative overflow-hidden">
                {/* Background photo */}
                <Image
                  src="/images/3C1AFB4B-943C-4129-A3CC-B6D39517F45A.png"
                  alt=""
                  fill
                  className="object-cover object-center"
                  aria-hidden="true"
                />
                {/* Dark overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/55 to-black/75" />
                <div className="w-56 h-56 mx-auto mb-6 flex items-center justify-center relative z-10">
                  <Image
                    src="/images/B6E31839-3169-4CE4-A5D6-A45D2ED27628.png"
                    alt="Brass Note Studios"
                    width={224}
                    height={224}
                    className="w-full h-full object-contain"
                  />
                </div>
                <p className="font-display text-2xl text-text-base text-center mb-2 relative z-10">
                  Brass Note Studios
                </p>
                <p className="text-gold text-sm italic font-body text-center relative z-10">
                  Custom Songwriting &amp; Production
                </p>
                <div className="mt-8 pt-8 border-t border-white/10 w-full grid grid-cols-2 gap-4 relative z-10">
                  <div className="flex flex-col items-center gap-1.5">
                    <Award className="w-5 h-5 text-gold" />
                    <span className="font-display text-2xl text-gold">30+</span>
                    <span className="text-text-muted text-xs font-body text-center">Years as Musicians &amp; Songwriters</span>
                  </div>
                  <div className="flex flex-col items-center gap-1.5">
                    <Disc3 className="w-5 h-5 text-gold" />
                    <span className="font-display text-lg text-gold">Several</span>
                    <span className="text-text-muted text-xs font-body text-center">Albums on Spotify</span>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 w-24 h-24 border-b-2 border-r-2 border-gold/20 rounded-br-2xl pointer-events-none" />
            </div>

            {/* Story text */}
            <div className="flex flex-col gap-6">
              <h2 className="font-display text-3xl text-text-base leading-tight">
                The Story Behind the Studio
              </h2>
              <div className="flex flex-col gap-4 text-text-muted font-body leading-relaxed">
                <p>
                  Our team has been writing and performing music for over 30 years.
                  That experience — spanning decades of crafting songs, studying
                  what makes a lyric land, and understanding how music moves
                  people — is the foundation everything at Brass Note Studios is
                  built on.
                </p>
                <p>
                  We&apos;ve released several studio-quality albums on Spotify featuring
                  original songs produced using Suno AI. Those albums are a testament
                  to what&apos;s possible when genuine songwriting craft meets modern
                  production technology — professional sound, personal stories, and
                  music that holds up alongside anything on the platform.
                </p>
                <p>
                  Brass Note Studios was built to give everyone access to custom,
                  professional-quality music that tells their story — because original
                  commissioned music shouldn&apos;t be reserved for Hollywood productions
                  and major label budgets. With Suno handling the production side,
                  we focus entirely on what we do best: the writing.
                </p>
                <p>
                  What sets our productions apart goes deeper than craft. Every song
                  we deliver has passed through the Brass Note Labs production
                  pipeline — our internal research and development division dedicated
                  to understanding exactly what makes AI-generated music work at a
                  professional level. We don&apos;t rely on intuition alone. We measure,
                  document, and refine every production decision so that the quality
                  you hear isn&apos;t an accident. It&apos;s a standard.
                </p>
                <p>
                  Every song in this portfolio was written by hand — not generated,
                  not templated. Our team writes the lyrics, shapes the narrative,
                  and directs the production from the first word to the final note.
                  The result is music that feels human because it is.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <GoldDivider className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" />

      {/* Values */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-surface">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <SectionHeading
              eyebrow="Our Values"
              title="What We Stand For"
              centered
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {values.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="bg-surface-elevated rounded-lg p-8 border border-white/5 hover:border-gold/20 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-gold" />
                </div>
                <h3 className="font-display text-lg text-text-base mb-2">
                  {title}
                </h3>
                <p className="text-text-muted font-body text-sm leading-relaxed">
                  {description}
                </p>
              </div>
            ))}
          </div>

          {/* Fifth card — full-width anchor */}
          <div className="mt-6 flex justify-center">
            <div className="w-full max-w-2xl bg-surface-elevated rounded-lg p-8 border border-white/5 hover:border-gold/20 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center mb-4">
                <FlaskConical className="w-5 h-5 text-gold" />
              </div>
              <h3 className="font-display text-lg text-text-base mb-2">
                Measured Standards
              </h3>
              <p className="text-text-muted font-body text-sm leading-relaxed">
                Behind every Brass Note Studios production is Brass Note Labs — our R&amp;D division dedicated
                to ensuring every song meets the same professional standard. We don&apos;t rely on intuition
                alone. We measure, document, and refine so that quality isn&apos;t something you hope for.
                It&apos;s something we guarantee.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Suno AI */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <SectionHeading
            eyebrow="Transparency"
            title="Why Suno AI?"
            subtitle="We believe in being upfront about how the music is made."
            centered
            className="mb-8"
          />
          <div className="text-text-muted font-body leading-relaxed flex flex-col gap-4">
            <p>
              Suno AI gives us a degree of control over the generative process
              that most platforms simply don&apos;t offer — precise enough to execute
              our proprietary production framework at the level our clients expect.
              That control, combined with genuine songwriting craft, is what
              separates a Brass Note Studios production from anything else in this
              space.
            </p>
            <p>
              The lyrics are ours. The story is yours. The production is powered
              by the most precise tool available for the job. That&apos;s the Brass
              Note Studios model.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-surface text-center border-t border-white/5">
        <div className="max-w-xl mx-auto">
          <h2 className="font-display text-3xl text-text-base mb-4">
            Ready to Work Together?
          </h2>
          <p className="text-text-muted font-body mb-8">
            Your story is waiting to become a song.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center font-body font-semibold tracking-wide bg-gold text-background hover:bg-gold-light rounded-sm px-8 py-4 text-lg transition-colors duration-200"
          >
            Commission a Song
          </Link>
        </div>
      </section>
    </div>
  );
}
