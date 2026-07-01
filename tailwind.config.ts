import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0A0A0A",
        surface: "#111111",
        "surface-elevated": "#1A1510",
        "border-subtle": "#2A2218",
        gold: {
          DEFAULT: "#C9A84C",
          light: "#E8C96A",
          bright: "#E8C96A",
          dark: "#9E7830",
          muted: "#8B6914",
        },
        teal: "#00B4B4",
        "teal-dim": "#006666",
        amber: "#92400E",
        "text-base": "#F5F0E8",
        "text-secondary": "#A89880",
        "text-muted": "#A89880",
        "text-subtle": "#5A4E3A",
      },
      fontFamily: {
        display: ["var(--font-cormorant)", "Georgia", "serif"],
        "display-sc": ["var(--font-cormorant-sc)", "Georgia", "serif"],
        body: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["Courier New", "Courier", "monospace"],
      },
      backgroundImage: {
        "gold-gradient":
          "linear-gradient(135deg, #C9A84C 0%, #E8C96A 50%, #C9A84C 100%)",
        "dark-gradient": "linear-gradient(180deg, #0A0A0A 0%, #111111 100%)",
        "navy-gradient": "linear-gradient(180deg, #0A0A0A 0%, #111111 100%)",
        "gold-shimmer":
          "linear-gradient(135deg, #111111 0%, #1A1510 40%, #111111 100%)",
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out",
        "slide-up": "slideUp 0.5s ease-out",
        "pulse-gold": "pulseGold 2s ease-in-out infinite",
        "float-particle": "floatParticle linear infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pulseGold: {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(212,168,67,0)" },
          "50%": { boxShadow: "0 0 0 8px rgba(212,168,67,0.1)" },
        },
        floatParticle: {
          "0%": { transform: "translateY(100vh) rotate(0deg)", opacity: "0" },
          "10%": { opacity: "1" },
          "90%": { opacity: "0.6" },
          "100%": { transform: "translateY(-10vh) rotate(360deg)", opacity: "0" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
