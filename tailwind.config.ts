module.exports = {
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        blue: "#6B59D6",
        green: "#82AF81",
        darkWhite: "#DBDBDB",
        lightWhite: "#E2E2E2",
        darkBlack: "#2B2B2B",
        lightBlack: "#323232",
      },
      fontFamily: {
        primary: ["Inter"],
      },
    },
    textFillColor: (theme) => theme('borderColor'),
    textStrokeColor: (theme) => theme('borderColor'),
    textStrokeWidth: (theme) => theme('borderWidth'),
  },
  plugins: [
    require("tailwindcss-text-fill-stroke"), // no options to configure
  ],
};
