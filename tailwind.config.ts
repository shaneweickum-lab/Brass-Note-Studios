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
        background: "#0D1B2A",
        surface: "#142030",
        "surface-elevated": "#112233",
        gold: {
          DEFAULT: "#C9A84C",
          light: "#E8C46A",
          dark: "#9E7830",
          muted: "#8B6914",
        },
        teal: "#1A6B8A",
        amber: "#FF9A3C",
        "text-base": "#F5F0E8",
        "text-muted": "#8A9BB0",
        "text-subtle": "#556070",
      },
      fontFamily: {
        display: ["var(--font-playfair)", "Georgia", "serif"],
        body: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["Courier New", "Courier", "monospace"],
      },
      backgroundImage: {
        "gold-gradient":
          "linear-gradient(135deg, #C9A84C 0%, #E8C46A 50%, #C9A84C 100%)",
        "dark-gradient": "linear-gradient(180deg, #0D1B2A 0%, #142030 100%)",
        "navy-gradient": "linear-gradient(180deg, #0D1B2A 0%, #112233 100%)",
        "gold-shimmer":
          "linear-gradient(135deg, #142030 0%, #1a2d45 40%, #142030 100%)",
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
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(201, 168, 76, 0)" },
          "50%": { boxShadow: "0 0 0 8px rgba(201, 168, 76, 0.1)" },
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
