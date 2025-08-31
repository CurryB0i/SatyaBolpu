/** @type {import('tailwindcss').Config} */
const plugin = require('tailwindcss/plugin');

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  safelist : [
    'h-[1500vh]'
  ],
  theme: {
    extend: {
      colors: {
        primary: "#E88138",
      },
      fontFamily: {
        cursive: '"Charm", serif',
      },
      height: {
        '1500vh' : '1500vh'
      }
    },
  },
  plugins: [
    plugin(function ({ matchUtilities, theme }) {
      matchUtilities(
        {
          "text-stroke": (value) => ({
            "-webkit-text-stroke-width": value,
          }),
        },
        { values: theme("borderWidth") }
      );

      matchUtilities(
        {
          "text-stroke-color": (value) => ({
            "-webkit-text-stroke-color": value,
          }),
        },
        { values: theme("borderColor") }
      );
    }),
  ],
};
