import type { Config } from "tailwindcss";
import plugin from "tailwind-scrollbar-hide";

const config: Config = {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
        sans: [
          "Poppins",
          ...require("tailwindcss/defaultTheme").fontFamily.sans,
        ], // <-- override 'sans' to use Poppins
      },
    },
  },
  plugins: [plugin],
};

export default config;

