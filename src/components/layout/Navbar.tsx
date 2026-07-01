"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/about",    label: "The Studio" },
  { href: "/music",    label: "Music"       },
  { href: "/blog",     label: "Journal"     },
  { href: "/labs",     label: "Labs",  teal: true },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b border-border-subtle"
      style={{ background: "rgba(10,10,10,0.94)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Atelier Logo */}
          <Link
            href="/"
            className="flex items-center"
            onClick={() => setOpen(false)}
          >
            <Image
              src="/images/0B0ACD04-F24F-42EE-B65E-4B07CB4ADC11.png"
              alt="Brass Note Studios"
              width={240}
              height={64}
              className="h-10 md:h-12 w-auto"
              style={{ objectFit: "contain", objectPosition: "left" }}
              priority
            />
          </Link>

          {/* Desktop Nav — centered */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map(({ href, label, teal }) => {
              const isActive = pathname === href || pathname.startsWith(href + "/");
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "font-body text-[11px] font-normal tracking-[0.2em] uppercase transition-colors",
                    isActive
                      ? teal ? "text-teal" : "text-gold"
                      : teal
                        ? "text-text-muted hover:text-teal"
                        : "text-text-muted hover:text-text-base"
                  )}
                >
                  {label}
                </Link>
              );
            })}
          </div>

          {/* Right: Commission CTA */}
          <div className="hidden md:flex items-center">
            <Link
              href="/contact"
              className="btn-gold-glow font-body text-[11px] font-normal tracking-[0.2em] uppercase border border-gold/50 text-gold hover:bg-gold/8 hover:border-gold px-5 py-2.5 transition-all duration-200"
            >
              Commission a Song
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-text-subtle hover:text-text-base p-2"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div
          className="md:hidden border-t border-border-subtle"
          style={{ background: "rgba(10,10,10,0.98)" }}
        >
          <div className="px-4 py-6 flex flex-col gap-4">
            {navLinks.map(({ href, label, teal }) => {
              const isActive = pathname === href || pathname.startsWith(href + "/");
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "font-body text-xs font-normal tracking-[0.2em] uppercase py-1.5 transition-colors",
                    isActive
                      ? teal ? "text-teal" : "text-gold"
                      : "text-text-muted hover:text-text-base"
                  )}
                  onClick={() => setOpen(false)}
                >
                  {label}
                </Link>
              );
            })}
            <Link
              href="/contact"
              onClick={() => setOpen(false)}
              className="font-body text-xs font-normal tracking-[0.2em] uppercase border border-gold/50 text-gold px-5 py-3 text-center transition-all duration-200 w-full mt-2"
            >
              Commission a Song
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
