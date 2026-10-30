/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        dark: {
          bg: "#0A0C10",
          card: "#12151D",
          hover: "#181D28",
          border: "rgba(255, 255, 255, 0.08)",
          subtle: "#8A94A6",
        },
        gold: {
          50: "#FAF7EE",
          100: "#F4ECD3",
          200: "#E9D8A4",
          300: "#DFC173",
          400: "#D8AF4E",
          500: "#D4AF37", // Primary Champagne Gold
          600: "#BA952A",
          700: "#947321",
          800: "#775B21",
          900: "#634B20",
          glow: "rgba(212, 175, 55, 0.25)",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      backgroundImage: {
        "gold-gradient": "linear-gradient(135deg, #F3E7C4 0%, #D4AF37 50%, #AA8222 100%)",
        "gold-glow": "radial-gradient(ellipse at top, rgba(212, 175, 55, 0.15), transparent 70%)",
      },
    },
  },
  plugins: [],
};
