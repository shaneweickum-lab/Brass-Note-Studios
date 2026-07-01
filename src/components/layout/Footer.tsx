import Link from "next/link";
import { ExternalLink } from "lucide-react";
import GoldDivider from "@/components/ui/GoldDivider";
import ReplaySequenceButton from "@/components/ui/ReplaySequenceButton";

const studioLinks = [
  { href: "/about",    label: "The Studio" },
  { href: "/services", label: "Pricing"    },
  { href: "/blog",     label: "Journal"    },
];

const collectionLinks = [
  { href: "/music", label: "Our Work"        },
  { href: "/labs",  label: "Brass Note Labs" },
];

export default function Footer() {
  return (
    <footer className="bg-background border-t border-border-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">

        {/* BNS Monogram + Tagline */}
        <div className="text-center mb-14">
          <Link href="/" className="inline-block">
            <span className="font-display text-gold font-semibold tracking-[0.1em]" style={{ fontSize: "2rem", lineHeight: 1 }}>
              BNS
            </span>
          </Link>
          <p className="text-text-subtle font-display text-sm italic mt-2 tracking-wide">
            Your Story. Preserved.
          </p>
        </div>

        {/* Three-column nav */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
          <div>
            <h4 className="font-display-sc text-gold/50 text-[10px] uppercase tracking-[0.25em] mb-5">
              The Studio
            </h4>
            <ul className="flex flex-col gap-2.5">
              {studioLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-text-muted/60 hover:text-gold font-body text-xs tracking-wide transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display-sc text-gold/50 text-[10px] uppercase tracking-[0.25em] mb-5">
              The Collection
            </h4>
            <ul className="flex flex-col gap-2.5">
              {collectionLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-text-muted/60 hover:text-gold font-body text-xs tracking-wide transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display-sc text-gold/50 text-[10px] uppercase tracking-[0.25em] mb-5">
              Connect
            </h4>
            <div className="flex flex-col gap-3">
              <a
                href="https://suno.com/@brassnotelabs"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-text-muted/60 hover:text-gold font-body text-xs tracking-wide transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Listen on Suno
              </a>
              <Link href="/contact" className="text-text-muted/60 hover:text-gold font-body text-xs tracking-wide transition-colors">
                Commission a Song
              </Link>
            </div>
          </div>
        </div>

        <GoldDivider className="mb-6 opacity-25" />

        <div className="flex flex-col items-center gap-2 text-center">
          <p className="text-text-subtle font-body text-xs tracking-wide">
            © {new Date().getFullYear()} Brass Note Studios. All rights reserved. Crafted with intention.
          </p>
          <p className="text-text-subtle/50 font-body text-xs">
            Your information is never shared or sold.
          </p>
          <p className="mt-1 text-text-subtle/40 font-body text-xs">
            Website designed &amp; built by{" "}
            <Link href="/labs" className="hover:text-teal transition-colors">
              Brass Note Labs
            </Link>
            .
          </p>
          <div className="mt-2">
            <ReplaySequenceButton />
          </div>
        </div>
      </div>
    </footer>
  );
}
