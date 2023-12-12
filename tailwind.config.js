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
      },
    },
  },
  plugins: [],
};
