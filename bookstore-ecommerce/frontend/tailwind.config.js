/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0f172a",
        sand: "#f7f2ea",
        pine: "#0f766e",
        ember: "#d97706",
        clay: "#e7d9c5",
      },
      fontFamily: {
        sans: ["Manrope", "sans-serif"],
        display: ["Fraunces", "serif"],
      },
      boxShadow: {
        soft: "0 10px 30px rgba(15, 23, 42, 0.12)",
        card: "0 14px 36px rgba(15, 23, 42, 0.16)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.7s ease-out both",
        float: "float 6s ease-in-out infinite",
      },
      backgroundImage: {
        grain: "radial-gradient(circle at 1px 1px, rgba(15, 23, 42, 0.08) 1px, transparent 0)",
      },
    },
  },
  plugins: [],
}
