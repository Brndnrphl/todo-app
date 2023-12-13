/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./views/**/*.ejs", "./public/css/*.", "./index.js"],
  theme: {
    extend: {
      fontFamily: {
        JetBrains: ["JetBrains Mono", "sans-serif"],
      },
      fontSize: {
        0: "0",
        vsm: "0.5rem",
        med: "0.7rem",
      },
      scale: { 200: "2.0" },
      maxWidth: { bar: "658px" },
      width: { bar: "89%" },
    },
  },
  plugins: [],
};
