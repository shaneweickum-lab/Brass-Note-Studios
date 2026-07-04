import fs from "fs";
import path from "path";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import matter from "gray-matter";
import { Calendar, Tag, ChevronLeft } from "lucide-react";
import GoldDivider from "@/components/ui/GoldDivider";

const POSTS_DIR = path.join(process.cwd(), "src/data/posts");

interface PostData {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  published: boolean;
  content: string;
}

function getPost(slug: string): PostData | null {
  const filePath = path.join(POSTS_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  return {
    slug,
    title: data.title as string,
    excerpt: data.excerpt as string,
    category: data.category as string,
    date: data.date as string,
    published: data.published as boolean,
    content,
  };
}

export function generateStaticParams() {
  const files = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith(".md"));
  return files.map((f) => ({ slug: f.replace(".md", "") }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const post = getPost(params.slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `https://brassnotestudios.com/blog/${params.slug}` },
    openGraph: {
      title: `${post.title} | Brass Note Studios`,
      description: post.excerpt,
      type: "article",
      url: `https://brassnotestudios.com/blog/${params.slug}`,
      publishedTime: post.date,
    },
    twitter: {
      card: "summary_large_image",
      title: `${post.title} | Brass Note Studios`,
      description: post.excerpt,
    },
  };
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// Simple markdown renderer — handles the specific patterns used in our posts
function renderMarkdown(markdown: string): React.ReactNode {
  const lines = markdown.split("\n");
  const elements: React.ReactNode[] = [];
  let i = 0;
  let key = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (!line.trim()) { i++; continue; }

    // ## Heading
    if (line.startsWith("## ")) {
      elements.push(
        <h2 key={key++} className="font-display text-2xl text-text-base mt-10 mb-2">
          {line.slice(3).trim()}
        </h2>
      );
      i++;
      continue;
    }

    // ### Subheading
    if (line.startsWith("### ")) {
      elements.push(
        <h3 key={key++} className="font-display text-xl text-text-base mt-8 mb-2">
          {line.slice(4).trim()}
        </h3>
      );
      i++;
      continue;
    }

    // > Blockquote — collect all consecutive > lines
    if (line.startsWith("> ") || line === ">") {
      const quoteLines: string[] = [];
      while (i < lines.length && (lines[i].startsWith("> ") || lines[i] === ">")) {
        quoteLines.push(lines[i] === ">" ? "" : lines[i].slice(2));
        i++;
      }
      const attrIdx = quoteLines.findIndex((l) => l.startsWith("— "));
      const quoteText = quoteLines
        .slice(0, attrIdx >= 0 ? attrIdx : undefined)
        .filter((l) => l.trim() !== "")
        .join(" ");
      const attribution = attrIdx >= 0 ? quoteLines[attrIdx].slice(2) : null;
      elements.push(
        <blockquote key={key++} className="my-6 border-l-2 border-gold pl-6">
          <p className="font-display text-xl text-text-base italic leading-relaxed">
            &ldquo;{quoteText}&rdquo;
          </p>
          {attribution && (
            <cite className="block mt-2 text-gold text-sm font-body not-italic">
              — {attribution}
            </cite>
          )}
        </blockquote>
      );
      continue;
    }

    // - Unordered list — collect consecutive - lines
    if (line.startsWith("- ")) {
      const items: string[] = [];
      while (i < lines.length && lines[i].startsWith("- ")) {
        items.push(lines[i].slice(2).trim());
        i++;
      }
      elements.push(
        <ul key={key++} className="flex flex-col gap-2 my-2">
          {items.map((item, j) => (
            <li key={j} className="flex items-start gap-3">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gold shrink-0" />
              <span className="text-text-muted font-body leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>
      );
      continue;
    }

    // Paragraph — collect lines until a blank line or a block-level marker
    const paraLines: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() !== "" &&
      !lines[i].startsWith("#") &&
      !lines[i].startsWith(">") &&
      !lines[i].startsWith("- ")
    ) {
      paraLines.push(lines[i].trim());
      i++;
    }
    if (paraLines.length > 0) {
      elements.push(
        <p key={key++} className="text-text-muted font-body leading-relaxed">
          {paraLines.join(" ")}
        </p>
      );
    }
  }

  return <>{elements}</>;
}

export default function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = getPost(params.slug);
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
              {formatDate(post.date)}
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
          {renderMarkdown(post.content)}
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
              Commission a Song
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
