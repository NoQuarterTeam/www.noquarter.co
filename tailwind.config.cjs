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
      },
      fontFamily: {
        sans: ["Poppins", ...defaultTheme.fontFamily.sans],
        serif: ["Poppins", ...defaultTheme.fontFamily.serif],
      },
      animation: {
        sway: "sway 12s ease-in-out infinite",
        sway2: "sway2 20s ease-in-out infinite",
        sway3: "sway3 14s ease-in-out infinite",
      },
      keyframes: {
        sway: {
          "0%": {
            transform: "translate(0px, 0px) scale(1)",
          },
          "33%": {
            transform: "translate(200px, 200px) scale(1.2)",
          },
          "50%": {
            transform: "translate(400px, 400px) scale(1.5)",
          },
          "66%": {
            transform: "translate(200px, 200px) scale(1.2)",
          },
          "100%": {
            transform: "translate(0px, 0px) scale(1)",
          },
        },
        sway2: {
          "0%": {
            transform: "translate(0px, 0px) scale(1)",
          },
          "33%": {
            transform: "translate(-200px, 100px) scale(1.2)",
          },
          "50%": {
            transform: "translate(-500px, 400px) scale(1.5)",
          },
          "66%": {
            transform: "translate(-200px, 100px) scale(1.2)",
          },
          "100%": {
            transform: "translate(0px, 0px) scale(1)",
          },
        },
        sway3: {
          "0%": {
            transform: "translate(0px, 0px) scale(1)",
          },
          "33%": {
            transform: "translate(200px, -200px) scale(1.2)",
          },
          "50%": {
            transform: "translate(200px, -300px) scale(1.5)",
          },
          "66%": {
            transform: "translate(200px, -200px) scale(1.2)",
          },
          "100%": {
            transform: "translate(0px, 0px) scale(1)",
          },
        },
      },
    },
  },
  plugins: [],
}
