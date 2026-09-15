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
        background: "#08090B",
        editorial: {
          bg: "#08090B",
          canvas: "#0B0D10",
          card: "#111317",
          cardElevated: "#15171B",
          border: "#202328",
          borderHover: "#2C3038",
          textPrimary: "#F5F5F5",
          textSecondary: "#A7A9AD",
          textMuted: "#70737A",
          accent: "#2F80FF",
        },
        surface: {
          50: "#111317",
          100: "#15171B",
          200: "#1A1D23",
          300: "#22252D",
        },
        electric: {
          300: "#70A6FF",
          400: "#4D93FF",
          500: "#2F80FF",
          600: "#1A6BE6",
          glow: "#2F80FF",
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "glass-gradient": "linear-gradient(135deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.005) 100%)",
        "card-gradient": "linear-gradient(180deg, #111317 0%, #0B0D10 100%)",
      },
      boxShadow: {
        "editorial-sm": "0 1px 3px rgba(0, 0, 0, 0.5), 0 0 0 1px #202328",
        "editorial-md": "0 4px 16px rgba(0, 0, 0, 0.6), 0 0 0 1px #202328",
        "editorial-lg": "0 12px 32px rgba(0, 0, 0, 0.8), 0 0 0 1px #282B32",
        "glow-sm": "0 0 12px -2px rgba(47, 128, 255, 0.25)",
        "glow-md": "0 0 20px -3px rgba(47, 128, 255, 0.35)",
        "glow-lg": "0 0 32px -4px rgba(47, 128, 255, 0.45)",
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "float": "float 6s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
