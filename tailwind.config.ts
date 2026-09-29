import type { Config } from "tailwindcss";
import { colors, fontFamily, letterSpacing } from "./src/lib/theme";

const config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors,
      fontFamily,
      letterSpacing,
    },
  },
} satisfies Config;

export default config;
