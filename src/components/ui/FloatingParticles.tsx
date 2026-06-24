"use client";

import { useEffect, useRef } from "react";

const SYMBOLS = ["♩", "♪", "♫", "♬", "𝄞", "𝄢"];

interface Particle {
  symbol: string;
  x: number;
  duration: number;
  delay: number;
  size: number;
  opacity: number;
}

const PARTICLES: Particle[] = Array.from({ length: 18 }, (_, i) => ({
  symbol: SYMBOLS[i % SYMBOLS.length],
  x: (i / 18) * 100 + Math.random() * 5,
  duration: 12 + (i % 6) * 3,
  delay: -(i * 1.8),
  size: 14 + (i % 3) * 6,
  opacity: 0.08 + (i % 4) * 0.04,
}));

export default function FloatingParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      {PARTICLES.map((p, i) => (
        <span
          key={i}
          className="absolute font-display select-none"
          style={{
            left: `${p.x}%`,
            bottom: "-10%",
            fontSize: `${p.size}px`,
            color: "#C9A84C",
            opacity: p.opacity,
            animation: `floatParticle ${p.duration}s ${p.delay}s linear infinite`,
          }}
        >
          {p.symbol}
        </span>
      ))}
    </div>
  );
}
