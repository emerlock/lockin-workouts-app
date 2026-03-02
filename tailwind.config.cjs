/** @type {import("tailwindcss").Config} */
module.exports = {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "#6D28D9",
          primaryDark: "#4C1D95",
          primarySoft: "#EDE9FE",
          secondary: "#F97316",
          secondarySoft: "#FFEDD5",
          tertiary: "#FFFFFF",
          ink: "#312E81",
        },
      },
      boxShadow: {
        glow: "0 10px 30px rgba(109, 40, 217, 0.2)",
      },
    },
  },
  plugins: [],
};
