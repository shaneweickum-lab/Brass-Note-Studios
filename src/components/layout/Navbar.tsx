"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, Music2 } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/music", label: "Our Work" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About Us" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2.5 group"
            onClick={() => setOpen(false)}
          >
            <div className="w-8 h-8 rounded-full bg-gold-gradient flex items-center justify-center shrink-0">
              <Music2 className="w-4 h-4 text-background" />
            </div>
            <span className="font-display text-lg leading-tight text-text-base group-hover:text-gold transition-colors">
              Brass Note<br />
              <span className="text-gold text-sm">STUDIOS</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {links.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "font-body text-sm font-medium tracking-wide transition-colors",
                  pathname === href
                    ? "text-gold"
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
              Get Your Song
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
        <div className="md:hidden border-t border-white/5 bg-background/95 backdrop-blur-md">
          <div className="px-4 py-6 flex flex-col gap-4">
            {links.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "font-body text-base font-medium py-2 transition-colors",
                  pathname === href ? "text-gold" : "text-text-muted"
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
              Get Your Song
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
