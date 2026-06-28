import type { Metadata } from "next";
import Link from "next/link";
import { Calendar, Tag } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import GoldDivider from "@/components/ui/GoldDivider";
import postsDataRaw from "@/data/posts.json";
import type { Post } from "@/types";

export const metadata: Metadata = {
  title: "Blog — Brass Note Studios",
  description:
    "Insights, stories, and behind-the-scenes content from Brass Note Studios — the craft of custom songwriting and what makes music matter.",
};

const posts = postsDataRaw.posts as Post[];

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

const categoryColors: Record<string, string> = {
  "Insights": "text-gold border-gold/40",
  "Behind the Process": "text-teal border-teal/40",
  "Craft": "text-gold-light border-gold-light/40",
};

function categoryClass(cat: string) {
  return categoryColors[cat] ?? "text-gold border-gold/40";
}

export default function BlogPage() {
  const sorted = [...posts].sort(
    (a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime()
  );

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
            eyebrow="Blog"
            title="Thoughts on Music, Craft & Story"
            subtitle="Insights from the studio — the process behind custom songwriting, what makes lyrics land, and why the right song at the right moment changes everything."
            centered
          />
        </div>
      </section>

      <GoldDivider className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" />

      {/* Posts grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {sorted.length === 0 ? (
            <p className="text-text-muted font-body text-center py-16">
              No posts yet — check back soon.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {sorted.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group flex flex-col bg-surface rounded-lg border border-white/8 hover:border-gold/25 transition-colors overflow-hidden"
                >
                  {/* Card accent bar */}
                  <div className="h-1 w-full bg-gradient-to-r from-gold/60 via-gold/30 to-transparent" />

                  <div className="flex flex-col flex-1 p-6 gap-4">
                    {/* Category + date */}
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`inline-flex items-center gap-1.5 text-[10px] font-body font-semibold uppercase tracking-[0.15em] border rounded-sm px-2 py-0.5 ${categoryClass(post.category)}`}
                      >
                        <Tag className="w-2.5 h-2.5" />
                        {post.category}
                      </span>
                      <span className="flex items-center gap-1 text-text-subtle font-body text-xs">
                        <Calendar className="w-3 h-3" />
                        {formatDate(post.publishedDate)}
                      </span>
                    </div>

                    {/* Title */}
                    <h2 className="font-display text-lg text-text-base leading-snug group-hover:text-gold transition-colors">
                      {post.title}
                    </h2>

                    {/* Excerpt */}
                    <p className="text-text-muted font-body text-sm leading-relaxed flex-1 line-clamp-3">
                      {post.excerpt}
                    </p>

                    {/* Read more */}
                    <span className="text-gold font-body text-xs font-semibold tracking-wide group-hover:translate-x-1 transition-transform inline-flex items-center gap-1 mt-auto">
                      Read More →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-surface text-center border-t border-white/5">
        <div className="max-w-xl mx-auto">
          <h2 className="font-display text-3xl text-text-base mb-4">
            Ready to Commission a Song?
          </h2>
          <p className="text-text-muted font-body mb-8">
            Your story deserves more than a gift card.
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
