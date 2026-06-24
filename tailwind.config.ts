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
        background: "#0A0E1A",         // Signal Black — was #0D1B2A
        surface: "#0F172A",             // Midnight Blue — was #142030
        "surface-elevated": "#0F172A",  // Midnight Blue — was #112233
        gold: {
          DEFAULT: "#D4A843",           // Living Brass — was #C9A84C
          light: "#E8C46A",             // unchanged
          dark: "#9E7830",
          muted: "#8B6914",
        },
        teal: "#0D9488",               // Electric Teal — was #1A6B8A
        amber: "#92400E",              // Deep Amber — was #FF9A3C
        "text-base": "#FAF3E0",        // Warm Cream — was #F5F0E8
        "text-muted": "#8A9BB0",       // unchanged
        "text-subtle": "#556070",
      },
      fontFamily: {
        display: ["var(--font-playfair)", "Georgia", "serif"],
        body: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["Courier New", "Courier", "monospace"],
      },
      backgroundImage: {
        "gold-gradient":
          "linear-gradient(135deg, #D4A843 0%, #E8C46A 50%, #D4A843 100%)",
        "dark-gradient": "linear-gradient(180deg, #0A0E1A 0%, #0F172A 100%)",
        "navy-gradient": "linear-gradient(180deg, #0A0E1A 0%, #0F172A 100%)",
        "gold-shimmer":
          "linear-gradient(135deg, #0F172A 0%, #162035 40%, #0F172A 100%)",
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
