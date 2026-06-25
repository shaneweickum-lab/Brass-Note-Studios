"use client";

import { useEffect, useRef, useState } from "react";
import { Volume2 } from "lucide-react";
import { usePlayer } from "@/hooks/usePlaylist";

const ANTHEM_ID  = "song-007";
const STORAGE_KEY = "bns-welcome-seen";

// ── FTL star field ────────────────────────────────────────────────────────────

interface Star { x: number; y: number; z: number; pz: number }

function makeStars(W: number, H: number, n = 300): Star[] {
  return Array.from({ length: n }, () => ({
    x: (Math.random() - 0.5) * W * 2.5,
    y: (Math.random() - 0.5) * H * 2.5,
    z: Math.random() * 0.9 + 0.1,
    pz: 1,
  }));
}

// ── Message lines ─────────────────────────────────────────────────────────────
// Total message phase: ~1 600 ms (fade-out 300 + lines stagger + hold)
// FTL phase: ~3 400 ms
// Combined: 5 000 ms

const MESSAGE_LINES = [
  { text: "Sit down and enjoy the ride",     delay: 0,    cls: "text-text-base font-bold text-3xl md:text-4xl" },
  { text: "as we bring you in",              delay: 1.2,  cls: "text-text-muted text-xl md:text-2xl" },
  { text: "to our",                          delay: 2.3,  cls: "text-text-muted text-xl md:text-2xl" },
  { text: "digital space",                   delay: 3.1,  cls: "text-gold italic text-2xl md:text-3xl" },
];

// FTL timeline (ms) — these sum to 4 000 ms
const ACCEL_END   = 2800;
const FLASH_START = 2800;
const FLASH_END   = 3200;
const FADE_START  = 3200;
const FADE_END    = 4000;

// ── Component ─────────────────────────────────────────────────────────────────

type Stage = "modal" | "message" | "jumping" | "gone";

export default function WelcomeOverlay() {
  const [stage, setStage]       = useState<Stage>("gone");
  const [modalFade, setModalFade] = useState(false);   // triggers CSS fade-out
  const canvasRef   = useRef<HTMLCanvasElement>(null);
  const rafRef      = useRef<number>(0);
  const withMusicRef = useRef(false);
  const { play }    = usePlayer();
  const playRef     = useRef(play);
  useEffect(() => { playRef.current = play; }, [play]);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startSequence = (withMusic: boolean, fromModal = false) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    withMusicRef.current = withMusic;
    if (fromModal) {
      setModalFade(true);
      setTimeout(() => setStage("message"), 300);
      timerRef.current = setTimeout(() => setStage("jumping"), 5000);
    } else {
      setModalFade(false);
      setStage("message");
      timerRef.current = setTimeout(() => setStage("jumping"), 5000);
    }
  };

  // Show on first visit
  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) setStage("modal");
  }, []);

  // Global replay trigger — fired by the footer button
  useEffect(() => {
    const handler = () => startSequence(true);
    window.addEventListener("bns-replay-sequence", handler);
    return () => window.removeEventListener("bns-replay-sequence", handler);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Button handler — fades modal out, then shows message
  const handleEnter = (withMusic: boolean) => startSequence(withMusic, true);

  // FTL canvas animation
  useEffect(() => {
    if (stage !== "jumping") return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const W = (canvas.width  = canvas.offsetWidth);
    const H = (canvas.height = canvas.offsetHeight);
    const ctx = canvas.getContext("2d")!;
    const cx = W / 2;
    const cy = H / 2;

    const stars = makeStars(W, H);
    let elapsed = 0;
    let last    = performance.now();

    // Match the dark background — seamless cut
    ctx.fillStyle = "rgb(13,10,11)";
    ctx.fillRect(0, 0, W, H);

    const frame = (now: number) => {
      const dt = Math.min(now - last, 50);
      last = now;
      elapsed += dt;

      const t     = Math.min(elapsed / ACCEL_END, 1);
      const speed = 0.003 + Math.pow(t, 2.5) * 0.14;

      // Trail
      ctx.fillStyle = "rgba(0,0,0,0.35)";
      ctx.fillRect(0, 0, W, H);

      // Stars
      for (const s of stars) {
        s.pz = s.z;
        s.z -= speed;
        if (s.z <= 0) {
          s.x  = (Math.random() - 0.5) * W * 2.5;
          s.y  = (Math.random() - 0.5) * H * 2.5;
          s.z  = 1;
          s.pz = 1;
          continue;
        }
        const sx = s.x / s.z + cx, sy = s.y / s.z + cy;
        const px = s.x / s.pz + cx, py = s.y / s.pz + cy;
        if (sx < -60 || sx > W + 60 || sy < -60 || sy > H + 60) continue;

        const nearness = 1 - s.z;
        const alpha    = Math.min(1, nearness * 1.5 + 0.15);
        const thick    = 0.4 + nearness * 2.8;

        // Blue-white → teal → gold as stars approach
        let r: number, g: number, b: number;
        if (nearness < 0.5) {
          const u = nearness / 0.5;
          r = Math.round(180 + u * (13  - 180));
          g = Math.round(210 + u * (148 - 210));
          b = Math.round(255 + u * (136 - 255));
        } else {
          const u = (nearness - 0.5) / 0.5;
          r = Math.round(13  + u * (201 - 13));
          g = Math.round(148 + u * (146 - 148));
          b = Math.round(136 + u * (26  - 136));
        }

        ctx.strokeStyle = `rgba(${r},${g},${b},${alpha})`;
        ctx.lineWidth   = thick;
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(sx, sy);
        ctx.stroke();
      }

      // White flash
      if (elapsed >= FLASH_START) {
        const ft = Math.min((elapsed - FLASH_START) / (FLASH_END - FLASH_START), 1);
        ctx.fillStyle = `rgba(255,255,255,${ft})`;
        ctx.fillRect(0, 0, W, H);
      }

      // Fade to black → done
      if (elapsed >= FADE_START) {
        const ft = Math.min((elapsed - FADE_START) / (FADE_END - FADE_START), 1);
        ctx.fillStyle = `rgba(0,0,0,${ft})`;
        ctx.fillRect(0, 0, W, H);
        if (ft >= 1) {
          localStorage.setItem(STORAGE_KEY, "1");
          if (withMusicRef.current) playRef.current(ANTHEM_ID);
          setStage("gone");
          return;
        }
      }

      rafRef.current = requestAnimationFrame(frame);
    };

    rafRef.current = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(rafRef.current);
  }, [stage]);

  if (stage === "gone") return null;

  return (
    <div className="fixed inset-0 z-[300]" style={{ background: "rgb(13,10,11)" }}>

      {/* FTL canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ display: stage === "jumping" ? "block" : "none" }}
      />

      {/* ── Stage: modal ── */}
      {stage === "modal" && (
        <div
          className="absolute inset-0 flex items-center justify-center px-6 transition-opacity duration-300"
          style={{ opacity: modalFade ? 0 : 1, backdropFilter: "blur(6px)" }}
        >
          <div className="text-center max-w-sm mx-auto">
            <div className="relative w-20 h-20 mx-auto mb-8">
              <span
                className="absolute inset-0 rounded-full bg-gold/20 animate-ping"
                style={{ animationDuration: "1.8s" }}
              />
              <div className="relative w-20 h-20 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center">
                <Volume2 className="w-9 h-9 text-gold" />
              </div>
            </div>

            <p className="text-gold font-body text-[10px] uppercase tracking-[0.25em] font-semibold mb-3">
              Welcome to Brass Note Studios
            </p>
            <h2 className="font-display text-3xl md:text-4xl text-text-base font-bold leading-tight mb-4">
              Turn up your volume.
            </h2>
            <p className="text-text-muted font-body text-sm leading-relaxed mb-10">
              For the best experience, turn up your volume before you enter.
              We have music to share.
            </p>

            <button
              onClick={() => handleEnter(true)}
              className="inline-flex items-center gap-3 bg-gold text-background font-body font-semibold px-8 py-4 rounded-sm hover:bg-gold-light transition-colors duration-200 text-sm tracking-wide w-full justify-center"
            >
              <Volume2 className="w-4 h-4" />
              I&apos;m Ready — Turn It Up
            </button>
            <button
              onClick={() => handleEnter(false)}
              className="block mx-auto mt-4 text-text-subtle/50 text-xs font-body hover:text-text-subtle transition-colors"
            >
              Skip
            </button>
          </div>
        </div>
      )}

      {/* ── Stage: message ── */}
      {stage === "message" && (
        <div className="absolute inset-0 flex items-center justify-center px-6">
          <div className="text-center max-w-xl mx-auto font-display space-y-2">
            {MESSAGE_LINES.map(({ text, delay, cls }) => (
              <p
                key={text}
                className={cls}
                style={{
                  opacity: 0,
                  animation: `fade-in-up 0.8s ease forwards`,
                  animationDelay: `${delay}s`,
                }}
              >
                {text}
              </p>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
