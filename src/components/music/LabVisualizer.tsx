"use client";

import { useEffect, useRef } from "react";
import { usePlayer } from "@/hooks/usePlaylist";
import { X, Activity } from "lucide-react";

export default function LabVisualizer() {
  const { currentSong, playerState, analyser, pause, currentTime, duration } =
    usePlayer();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const scanYRef = useRef(0);

  const isVisible =
    currentSong?.category === "From the Lab" &&
    (playerState === "playing" || playerState === "loading");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isVisible) {
      cancelAnimationFrame(rafRef.current);
      return;
    }

    const ctx = canvas.getContext("2d")!;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const TEAL = "#0D9488";
    const BRASS = "#C9921A";
    const GRID = 40;

    const freqBuf = analyser ? new Uint8Array(analyser.frequencyBinCount) : null;
    const waveBuf = analyser ? new Uint8Array(analyser.fftSize) : null;

    // Clear canvas on first frame
    ctx.fillStyle = "rgba(10,14,26,1)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const draw = () => {
      if (!canvas.isConnected) return;
      const W = canvas.offsetWidth;
      const H = canvas.offsetHeight;

      if (analyser && freqBuf && waveBuf) {
        analyser.getByteTimeDomainData(waveBuf);
        analyser.getByteFrequencyData(freqBuf);
      }

      // Trail fade
      ctx.fillStyle = "rgba(10,14,26,0.25)";
      ctx.fillRect(0, 0, W, H);

      // Teal grid
      ctx.strokeStyle = "rgba(13,148,136,0.08)";
      ctx.lineWidth = 0.5;
      for (let x = 0; x <= W; x += GRID) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
      }
      for (let y = 0; y <= H; y += GRID) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
      }

      // Horizontal scan line
      scanYRef.current = (scanYRef.current + 1.8) % H;
      const sg = ctx.createLinearGradient(0, scanYRef.current - 24, 0, scanYRef.current + 24);
      sg.addColorStop(0, "rgba(13,148,136,0)");
      sg.addColorStop(0.5, "rgba(13,148,136,0.22)");
      sg.addColorStop(1, "rgba(13,148,136,0)");
      ctx.fillStyle = sg;
      ctx.fillRect(0, scanYRef.current - 24, W, 48);

      // Oscilloscope — top ~40% of canvas
      const waveTop = H * 0.08;
      const waveH = H * 0.38;
      const waveMid = waveTop + waveH / 2;

      ctx.save();
      ctx.shadowColor = TEAL;
      ctx.shadowBlur = 10;
      ctx.strokeStyle = TEAL;
      ctx.lineWidth = 1.5;
      ctx.beginPath();

      if (waveBuf && analyser) {
        const step = W / waveBuf.length;
        for (let i = 0; i < waveBuf.length; i++) {
          const v = waveBuf[i] / 128 - 1;
          const y = waveMid + v * (waveH / 2);
          if (i === 0) ctx.moveTo(0, y);
          else ctx.lineTo(i * step, y);
        }
        ctx.lineTo(W, waveMid);
      } else {
        // Flat line + tiny noise while loading
        ctx.moveTo(0, waveMid);
        for (let x = 0; x <= W; x += 4) {
          ctx.lineTo(x, waveMid + (Math.random() - 0.5) * 4);
        }
      }
      ctx.stroke();
      ctx.restore();

      // Frequency bars — bottom 38% of canvas
      const barTop = H * 0.58;
      const barH = H * 0.36;
      const numBars = Math.min(freqBuf ? freqBuf.length : 64, 128);
      const barW = W / numBars;

      for (let i = 0; i < numBars; i++) {
        const val = freqBuf ? freqBuf[i] / 255 : 0.05;
        const h = val * barH;
        const x = i * barW;
        const y = barTop + barH - h;
        const bg = ctx.createLinearGradient(0, y, 0, barTop + barH);
        bg.addColorStop(0, `${BRASS}BB`);
        bg.addColorStop(0.35, `${TEAL}EE`);
        bg.addColorStop(1, `${TEAL}44`);
        ctx.fillStyle = bg;
        ctx.fillRect(x + 1, y, barW - 2, h);
      }

      // Brass corner brackets
      const bLen = 22;
      ctx.strokeStyle = BRASS;
      ctx.lineWidth = 2;
      const corners: [number, number, number, number][] = [
        [18, 18, 1, 1],
        [W - 18, 18, -1, 1],
        [18, H - 18, 1, -1],
        [W - 18, H - 18, -1, -1],
      ];
      for (const [cx, cy, sx, sy] of corners) {
        ctx.beginPath();
        ctx.moveTo(cx, cy + sy * bLen);
        ctx.lineTo(cx, cy);
        ctx.lineTo(cx + sx * bLen, cy);
        ctx.stroke();
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [isVisible, analyser]);

  if (!isVisible) return null;

  const progress = duration > 0 ? currentTime / duration : 0;
  const fmt = (t: number) => {
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div
      className="fixed inset-0 z-[200] flex flex-col"
      style={{ background: "rgba(10,14,26,0.97)" }}
    >
      {/* Canvas layer */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* Top bar */}
      <div className="relative z-10 flex items-center justify-between px-5 pt-4 pb-3 border-b border-teal/20">
        <div className="flex items-center gap-3">
          <span className="font-mono text-[10px] text-teal/70 uppercase tracking-[0.2em]">
            BRASS NOTE LABS · SIGNAL ANALYSIS
          </span>
          <span className="w-2 h-2 rounded-full bg-teal animate-pulse" />
          <span className="font-mono text-[9px] text-teal/50 uppercase tracking-widest">
            LIVE
          </span>
        </div>
        <button
          onClick={pause}
          className="flex items-center gap-2 px-4 py-2 border border-teal/40 rounded text-teal font-mono text-xs uppercase tracking-[0.15em] hover:bg-teal/10 transition-colors"
        >
          <X className="w-3.5 h-3.5" />
          EXIT
        </button>
      </div>

      {/* Song info */}
      <div className="relative z-10 px-5 pt-4">
        <p className="font-display text-white text-xl md:text-2xl leading-tight">
          {currentSong?.title}
        </p>
        <p className="font-body text-teal/70 text-sm mt-1">
          {currentSong?.clientName} &mdash; Written &amp; Produced by Brass Note Labs
        </p>
      </div>

      {/* Technical readouts — desktop only */}
      <div className="absolute right-5 top-20 z-10 hidden md:flex flex-col gap-2">
        {(
          [
            ["FFT", "2048"],
            ["SR", "44.1 kHz"],
            ["CH", "STEREO"],
            ["BIT", "32-FLT"],
            ["MODE", "ANALYSIS"],
          ] as [string, string][]
        ).map(([k, v]) => (
          <div key={k} className="flex items-center gap-2">
            <span className="font-mono text-[9px] text-teal/40 uppercase tracking-[0.15em] w-10">
              {k}
            </span>
            <span className="font-mono text-[9px] text-teal/70">{v}</span>
          </div>
        ))}
      </div>

      {/* Section label — oscilloscope */}
      <div className="relative z-10 px-5 mt-3 flex items-center gap-2">
        <Activity className="w-3 h-3 text-teal/40" />
        <span className="font-mono text-[9px] text-teal/40 uppercase tracking-[0.15em]">
          OSCILLOSCOPE · TIME DOMAIN
        </span>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Section label — spectrum */}
      <div className="relative z-10 px-5 mb-2">
        <span className="font-mono text-[9px] text-teal/40 uppercase tracking-[0.15em]">
          FREQUENCY SPECTRUM · FFT
        </span>
      </div>

      {/* Progress + time */}
      <div className="relative z-10 px-5 pb-6">
        <div className="flex items-center gap-3">
          <span className="font-mono text-[10px] text-teal/60 tabular-nums">
            {fmt(currentTime)}
          </span>
          <div className="relative flex-1 h-px bg-teal/20">
            <div
              className="absolute left-0 top-0 h-full bg-teal transition-all duration-300"
              style={{ width: `${progress * 100}%` }}
            />
            <div
              className="absolute top-1/2 w-2.5 h-2.5 rounded-full bg-teal border-2 border-background -translate-y-1/2 -translate-x-1/2"
              style={{ left: `${progress * 100}%` }}
            />
          </div>
          <span className="font-mono text-[10px] text-teal/60 tabular-nums">
            {fmt(duration)}
          </span>
        </div>
      </div>
    </div>
  );
}
