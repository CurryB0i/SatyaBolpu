import plugin from "tailwindcss/plugin";

export default {

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
