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
        background: "var(--background)",
        foreground: "var(--foreground)",
        pink: {
          50: "#FFF0F5",
          100: "#FFE4EC",
          200: "#FFCCD9",
          300: "#FFB3C7",
          400: "#FF8AAD",
          500: "#FF6B9D",
          600: "#E85A8A",
          700: "#C44569",
          800: "#A03759",
          900: "#7D2A47",
        },
        status: {
          bookmarked: "#6B7280",
          applying: "#3B82F6",
          applied: "#8B5CF6",
          interviewing: "#F59E0B",
          negotiating: "#EAB308",
          accepted: "#22C55E",
          withdrawn: "#9CA3AF",
          rejected: "#EF4444",
          noResponse: "#D1D5DB",
        },
      },
      backgroundImage: {
        "gradient-pink": "linear-gradient(135deg, #FF6B9D 0%, #C44569 100%)",
        "gradient-pink-light": "linear-gradient(135deg, #FFE4EC 0%, #FFCCD9 100%)",
        "gradient-pink-radial": "radial-gradient(circle, #FF6B9D 0%, #C44569 100%)",
      },
      boxShadow: {
        "pink": "0 4px 14px 0 rgba(255, 107, 157, 0.39)",
        "pink-lg": "0 10px 40px -10px rgba(255, 107, 157, 0.5)",
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-out",
        "slide-up": "slideUp 0.3s ease-out",
        "slide-down": "slideDown 0.3s ease-out",
        "scale-in": "scaleIn 0.2s ease-out",
        "bounce-in": "bounceIn 0.5s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideDown: {
          "0%": { transform: "translateY(-10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        scaleIn: {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        bounceIn: {
          "0%": { transform: "scale(0.3)", opacity: "0" },
          "50%": { transform: "scale(1.05)" },
          "70%": { transform: "scale(0.9)" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
