/** @type {import('tailwindcss').Config} */
module.exports = {
  // Only generate utilities for classes actually used in src/ — the rest of the
  // site ships a 6k-line hand-rolled stylesheet that must stay untouched, so we
  // DISABLE preflight (no base reset) and import Tailwind as a second layer.
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx,js,jsx}",
  ],
  corePlugins: { preflight: false },
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "rsarbos-navy": "#0a0f1c",
        "rsarbos-blue": "#1e5bff",
        "rsarbos-red": "#ff3b38",
        "rsarbos-surface": "#0f1424",
        "rsarbos-pearl": "#f8fafc",
        "rsarbos-muted": "#94a1b2",
      },
      keyframes: {
        float: {
          "0%,100%": { transform: "translateY(0) rotate(0deg)" },
          "50%": { transform: "translateY(-22px) rotate(6deg)" },
        },
        "pulse-ring": {
          "0%,100%": { opacity: "0.3", transform: "scale(1)" },
          "50%": { opacity: "0", transform: "scale(1.8)" },
        },
      },
      animation: {
        "float-slow": "float 14s ease-in-out infinite",
        "float-fast": "float 6s ease-in-out infinite",
        "pulse-ring": "pulse-ring 3s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
