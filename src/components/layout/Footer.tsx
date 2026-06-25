import Link from "next/link";
import Image from "next/image";
import { Instagram, ExternalLink } from "lucide-react";
import GoldDivider from "@/components/ui/GoldDivider";

const links = [
  { href: "/about",    label: "About" },
  { href: "/music",    label: "Our Work" },
  { href: "/labs",     label: "Brass Note Labs" },
  { href: "/services", label: "Pricing" },
  { href: "/contact",  label: "Commission a Song" },
];

const brands = [
  { href: "/",     label: "Brass Note Studios" },
  { href: "/labs", label: "Brass Note Labs" },
];

export default function Footer() {
  return (
    <footer className="bg-surface border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
          {/* Brand */}
          <div>
            <Link href="/" className="inline-flex mb-4">
              <Image
                src="/images/DBFDD7E0-A0B2-48AC-AB90-A49D689D4644.png"
                alt="Brass Note Studios"
                width={280}
                height={56}
                className="h-16 w-auto"
                style={{ objectFit: "contain", objectPosition: "left" }}
              />
            </Link>
            <p className="text-text-muted text-sm leading-relaxed max-w-xs">
              Custom songs written and produced for life's meaningful moments, brands, and organizations.
            </p>
          </div>

          {/* Nav */}
          <div>
            <h4 className="text-gold font-body text-xs uppercase tracking-[0.2em] font-semibold mb-4">
              Navigate
            </h4>
            <ul className="flex flex-col gap-2">
              {links.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-text-muted hover:text-gold text-sm transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="text-gold font-body text-xs uppercase tracking-[0.2em] font-semibold mb-4">
              Connect
            </h4>
            <div className="flex flex-col gap-3">
              <a
                href="https://suno.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-text-muted hover:text-gold text-sm transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                Listen on Suno
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-text-muted hover:text-gold text-sm transition-colors"
              >
                <Instagram className="w-4 h-4" />
                Instagram
              </a>
            </div>
          </div>
        </div>

        <GoldDivider className="mb-6" />

        {/* Brand ecosystem */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mb-6">
          {brands.map(({ href, label }, i) => (
            <span key={href} className="flex items-center gap-6">
              <Link href={href} className="text-text-subtle hover:text-gold text-xs font-body transition-colors">
                {label}
              </Link>
              {i < brands.length - 1 && (
                <span className="text-gold/30 text-xs">·</span>
              )}
            </span>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-text-subtle text-xs">
          <p>© {new Date().getFullYear()} Brass Note Studios. All rights reserved.</p>
          <p>All music written &amp; produced by Brass Note Studios.</p>
        </div>
        <p className="mt-3 text-center font-body text-text-subtle/40 text-xs">
          Website designed &amp; built by{" "}
          <Link href="/labs" className="hover:text-teal transition-colors">
            Brass Note Labs
          </Link>
          .
        </p>
      </div>
    </footer>
  );
}
