import type { Config } from "tailwindcss/types/config";
import colors from "tailwindcss/colors";

export default {
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
        sans: ["var(--font-karla)"],
        serif: ["var(--font-karla)"],
      },
    },
  },
  plugins: [],
} satisfies Config;
