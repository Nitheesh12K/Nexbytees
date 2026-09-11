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
        background: "#030712",
        surface: {
          50: "#0b1329",
          100: "#0e1834",
          200: "#132145",
          300: "#1c2e5c",
        },
        electric: {
          300: "#7dd3fc",
          400: "#38bdf8",
          500: "#0ea5e9",
          600: "#0284c7",
          glow: "#3b82f6",
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "glass-gradient": "linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%)",
        "card-gradient": "linear-gradient(180deg, rgba(14, 24, 52, 0.75) 0%, rgba(5, 9, 22, 0.95) 100%)",
      },
      boxShadow: {
        "glow-sm": "0 0 15px -3px rgba(56, 189, 248, 0.2)",
        "glow-md": "0 0 25px -5px rgba(56, 189, 248, 0.35)",
        "glow-lg": "0 0 40px -8px rgba(56, 189, 248, 0.45)",
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "float": "float 6s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
