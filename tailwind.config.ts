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
        background: "#0D0A0B",
        surface: "#1A1114",
        "surface-elevated": "#251820",
        gold: {
          DEFAULT: "#C9921A",
          light: "#E8B84B",
          dark: "#9E6E10",
          muted: "#8B6914",
        },
        "text-base": "#F5F0E8",
        "text-muted": "#8B7D6B",
        "text-subtle": "#5C4F45",
      },
      fontFamily: {
        display: ["var(--font-playfair)", "Georgia", "serif"],
        body: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "gold-gradient":
          "linear-gradient(135deg, #C9921A 0%, #E8B84B 50%, #C9921A 100%)",
        "dark-gradient": "linear-gradient(180deg, #0D0A0B 0%, #1A1114 100%)",
        "gold-shimmer":
          "linear-gradient(135deg, #1A1114 0%, #251820 40%, #2A1D20 60%, #1A1114 100%)",
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out",
        "slide-up": "slideUp 0.5s ease-out",
        "pulse-gold": "pulseGold 2s ease-in-out infinite",
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
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(201, 146, 26, 0)" },
          "50%": { boxShadow: "0 0 0 8px rgba(201, 146, 26, 0.1)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
