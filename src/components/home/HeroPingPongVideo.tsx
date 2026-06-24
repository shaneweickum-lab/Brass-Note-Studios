"use client";

import { useRef, useEffect } from "react";

export default function HeroPingPongVideo({ src }: { src: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let rafId: number;
    let lastTimestamp = 0;

    // Step backward one real-time tick per animation frame
    const stepBackward = (timestamp: number) => {
      if (!lastTimestamp) {
        lastTimestamp = timestamp;
        rafId = requestAnimationFrame(stepBackward);
        return;
      }

      const elapsed = (timestamp - lastTimestamp) / 1000; // seconds
      lastTimestamp = timestamp;
      video.currentTime = Math.max(0, video.currentTime - elapsed);

      if (video.currentTime <= 0) {
        // Reached the beginning — swing back to forward
        lastTimestamp = 0;
        video.play();
        return;
      }

      rafId = requestAnimationFrame(stepBackward);
    };

    // When forward playback ends, start reversing
    const handleEnded = () => {
      lastTimestamp = 0;
      rafId = requestAnimationFrame(stepBackward);
    };

    video.addEventListener("ended", handleEnded);

    return () => {
      video.removeEventListener("ended", handleEnded);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <video
      ref={videoRef}
      className="hidden md:block absolute inset-0 w-full h-full object-cover"
      autoPlay
      muted
      playsInline
      // No `loop` — the effect handles cycling manually
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}
