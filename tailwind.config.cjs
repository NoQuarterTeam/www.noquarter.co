const colors = require("tailwindcss/colors")
const defaultTheme = require("tailwindcss/defaultTheme")

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        gray: colors.neutral,
        "brand-purple": "#9B5DE5",
        "brand-green": "#00F5D4",
        "brand-pink": "#F15BB5",
        "brand-yellow": "#F3CE49",
      },
      fontFamily: {
        // sans: ["var(--font-poppins)"],
        // serif: ["var(--font-poppins)"],
        sans: ["var(--font-syne)"],
        serif: ["var(--font-zen)"],
      },
    },
  },
  plugins: [],
}
