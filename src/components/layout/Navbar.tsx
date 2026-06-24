"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/about", label: "About" },
  { href: "/music", label: "Music" },
  { href: "/method", label: "The Method", accent: true },
  { href: "/academy", label: "Academy" },
  { href: "/services", label: "Pricing" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b border-gold/20"
      style={{ background: "linear-gradient(180deg, rgba(24,15,5,0.96) 0%, rgba(18,11,3,0.93) 100%)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center"
            onClick={() => setOpen(false)}
          >
            <Image
              src="/images/DBFDD7E0-A0B2-48AC-AB90-A49D689D4644.png"
              alt="Brass Note Studios"
              width={400}
              height={80}
              className="h-[60px] md:h-[76px] w-auto"
              style={{ objectFit: "contain", objectPosition: "left" }}
              priority
            />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            {links.map(({ href, label, accent }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "font-body text-sm font-medium tracking-wide transition-colors",
                  pathname === href || pathname.startsWith(href + "/")
                    ? "text-gold border-b border-gold"
                    : accent
                    ? "text-gold hover:text-gold-light"
                    : "text-text-muted hover:text-text-base"
                )}
              >
                {label}
              </Link>
            ))}
            <Link
              href="/contact"
              className="inline-flex items-center justify-center font-body font-semibold tracking-wide bg-gold text-background hover:bg-gold-light rounded-sm px-4 py-2 text-sm transition-all duration-200"
            >
              Commission a Song
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-text-muted hover:text-text-base p-2"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div
          className="md:hidden border-t border-gold/15 backdrop-blur-md"
          style={{ background: "rgba(18, 11, 3, 0.98)" }}
        >
          <div className="px-4 py-6 flex flex-col gap-3">
            {links.map(({ href, label, accent }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "font-body text-base font-medium py-2 transition-colors",
                  pathname === href || pathname.startsWith(href + "/")
                    ? "text-gold"
                    : accent
                    ? "text-gold"
                    : "text-text-muted"
                )}
                onClick={() => setOpen(false)}
              >
                {label}
              </Link>
            ))}
            <Link
              href="/contact"
              onClick={() => setOpen(false)}
              className="inline-flex items-center justify-center font-body font-semibold tracking-wide bg-gold text-background hover:bg-gold-light rounded-sm px-6 py-3 text-base transition-all duration-200 w-full mt-2"
            >
              Commission a Song
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
