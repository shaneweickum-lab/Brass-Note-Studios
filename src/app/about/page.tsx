import type { Metadata } from "next";
import Link from "next/link";
import { Music2, Sparkles, Heart, Users, Award, Disc3 } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import GoldDivider from "@/components/ui/GoldDivider";

export const metadata: Metadata = {
  title: "About — The Story Behind Brass Note Studios",
  description:
    "Learn about Brass Note Studios — a custom songwriting and production studio dedicated to bringing your stories to life through music.",
};

const values = [
  {
    icon: Heart,
    title: "Personal Investment",
    description:
      "Every song starts with a real conversation. I take time to understand the people, moments, and emotions behind your project before I write a single word.",
  },
  {
    icon: Sparkles,
    title: "Creative Quality",
    description:
      "I don't believe in generic music. Each song is written from scratch with your specific story in mind — because cookie-cutter content can't capture real moments.",
  },
  {
    icon: Users,
    title: "Collaborative Spirit",
    description:
      "Your vision guides the whole process. I work with you through revisions until the song feels exactly right — this is your music, and you should love it.",
  },
  {
    icon: Music2,
    title: "Modern Production",
    description:
      "Using Suno AI's industry-leading music generation platform, I deliver professional-grade recordings that sound like they came from a full production studio.",
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
              <div className="aspect-square rounded-2xl bg-surface border border-gold/10 flex flex-col items-center justify-center p-12">
                <div className="w-24 h-24 rounded-full bg-gold/10 border-2 border-gold/30 flex items-center justify-center mb-6">
                  <span className="font-display text-4xl text-gold">BN</span>
                </div>
                <p className="font-display text-2xl text-text-base text-center mb-2">
                  Brass Note Studios
                </p>
                <p className="text-gold text-sm italic font-body text-center">
                  Custom Songwriting &amp; Production
                </p>
                <div className="mt-8 pt-8 border-t border-white/5 w-full grid grid-cols-2 gap-4">
                  <div className="flex flex-col items-center gap-1.5">
                    <Award className="w-5 h-5 text-gold" />
                    <span className="font-display text-2xl text-gold">30+</span>
                    <span className="text-text-muted text-xs font-body text-center">Years as a Musician &amp; Songwriter</span>
                  </div>
                  <div className="flex flex-col items-center gap-1.5">
                    <Disc3 className="w-5 h-5 text-gold" />
                    <span className="font-display text-2xl text-gold">2</span>
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
                  I&apos;ve been writing and performing music for over 30 years.
                  That experience — spanning decades of crafting songs, studying
                  what makes a lyric land, and understanding how music moves
                  people — is the foundation everything at Brass Note Studios is
                  built on.
                </p>
                <p>
                  I&apos;ve released two studio-quality albums on Spotify featuring
                  my original songs, produced using Suno AI. Those albums are a
                  testament to what&apos;s possible when genuine songwriting craft meets
                  modern production technology — professional sound, personal
                  stories, and music that holds up alongside anything on the
                  platform.
                </p>
                <p>
                  Brass Note Studios was born from that same combination. I
                  founded it to give everyone access to custom, professional-quality
                  music that tells their story — because original commissioned
                  music shouldn&apos;t be reserved for Hollywood productions and major
                  label budgets. With Suno handling the production side, I can
                  focus entirely on what I do best: the writing.
                </p>
                <p>
                  Every song in this portfolio was written personally — not
                  generated, not templated. I write the lyrics, shape the
                  narrative, and produce the final track. The result is music
                  that feels human because it is.
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
        </div>
      </section>

      {/* Why Suno AI */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <SectionHeading
            eyebrow="Transparency"
            title="Why Suno AI?"
            subtitle="I believe in being upfront about how the music is made."
            centered
            className="mb-8"
          />
          <div className="text-text-muted font-body leading-relaxed flex flex-col gap-4">
            <p>
              Suno AI is the most advanced AI music generation platform
              available today. It can produce full songs with vocals,
              instrumentation, and professional mixing — in virtually any genre
              — from text prompts and lyrics.
            </p>
            <p>
              I use Suno because it allows me to deliver studio-quality
              recordings at a price point that makes custom music accessible to
              everyone — without sacrificing the quality of the writing or the
              emotional depth of the final product.
            </p>
            <p>
              The lyrics are mine. The story is yours. The production is
              powered by the best tools available. That&apos;s the Brass Note
              Studios model.
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
            Get Your Song
          </Link>
        </div>
      </section>
    </div>
  );
}
