import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        light: "#DAFFDD",
        primary: "#4CAF50",
        secondary: "#395D45",
        tertiary: "#754669",
        dark: "#2C2C2C",
      },
      fontFamily: {
        inter: ['var(--font-inter)'],
        rowdies: ['var(--font-rowdies)'],
        gilroy: ['var(--font-gilroy)'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/aspect-ratio'),
  ],
};
export default config;
