import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, Tag, ChevronLeft } from "lucide-react";
import GoldDivider from "@/components/ui/GoldDivider";
import postsDataRaw from "@/data/posts.json";
import type { Post, ContentBlock } from "@/types";

const posts = postsDataRaw.posts as Post[];

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const post = posts.find((p) => p.slug === params.slug);
  if (!post) return {};
  return {
    title: `${post.title} — Brass Note Studios Blog`,
    description: post.excerpt,
  };
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function renderBlock(block: ContentBlock, i: number) {
  switch (block.type) {
    case "paragraph":
      return (
        <p key={i} className="text-text-muted font-body leading-relaxed">
          {block.text}
        </p>
      );
    case "heading":
      return (
        <h2
          key={i}
          className="font-display text-2xl text-text-base mt-10 mb-2"
        >
          {block.text}
        </h2>
      );
    case "subheading":
      return (
        <h3
          key={i}
          className="font-display text-xl text-text-base mt-8 mb-2"
        >
          {block.text}
        </h3>
      );
    case "quote":
      return (
        <blockquote
          key={i}
          className="my-6 border-l-2 border-gold pl-6"
        >
          <p className="font-display text-xl text-text-base italic leading-relaxed">
            &ldquo;{block.text}&rdquo;
          </p>
          {block.attribution && (
            <cite className="block mt-2 text-gold text-sm font-body not-italic">
              — {block.attribution}
            </cite>
          )}
        </blockquote>
      );
    case "list":
      return (
        <ul key={i} className="flex flex-col gap-2 my-2">
          {block.items.map((item, j) => (
            <li key={j} className="flex items-start gap-3">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gold shrink-0" />
              <span className="text-text-muted font-body leading-relaxed">
                {item}
              </span>
            </li>
          ))}
        </ul>
      );
    default:
      return null;
  }
}

export default function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = posts.find((p) => p.slug === params.slug);
  if (!post) notFound();

  return (
    <div>
      {/* Header */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(ellipse 60% 50% at 50% 0%, #C9921A33, transparent 70%)",
          }}
        />
        <div className="max-w-3xl mx-auto relative z-10">
          {/* Back link */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-text-muted hover:text-gold font-body text-sm transition-colors mb-8"
          >
            <ChevronLeft className="w-4 h-4" />
            All Posts
          </Link>

          {/* Meta */}
          <div className="flex items-center gap-3 mb-5">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-body font-semibold uppercase tracking-[0.15em] text-gold border border-gold/40 rounded-sm px-2 py-0.5">
              <Tag className="w-2.5 h-2.5" />
              {post.category}
            </span>
            <span className="flex items-center gap-1 text-text-subtle font-body text-xs">
              <Calendar className="w-3 h-3" />
              {formatDate(post.publishedDate)}
            </span>
          </div>

          {/* Title */}
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl text-text-base leading-tight mb-6">
            {post.title}
          </h1>

          {/* Excerpt */}
          <p className="text-text-muted font-body text-lg leading-relaxed">
            {post.excerpt}
          </p>
        </div>
      </section>

      <GoldDivider className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8" />

      {/* Content */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto flex flex-col gap-5">
          {post.content.map((block, i) => renderBlock(block, i))}
        </div>
      </section>

      <GoldDivider className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8" />

      {/* CTA */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-surface text-center border-t border-white/5">
        <div className="max-w-xl mx-auto">
          <h2 className="font-display text-3xl text-text-base mb-4">
            Ready to Commission a Song?
          </h2>
          <p className="text-text-muted font-body mb-8">
            Your story is waiting to become music.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center font-body font-semibold tracking-wide bg-gold text-background hover:bg-gold-light rounded-sm px-8 py-4 text-lg transition-colors duration-200"
            >
              Get Your Song
            </Link>
            <Link
              href="/blog"
              className="inline-flex items-center justify-center font-body text-text-muted hover:text-gold text-sm transition-colors"
            >
              ← Back to Blog
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
