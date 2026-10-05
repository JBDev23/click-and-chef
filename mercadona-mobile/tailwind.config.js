/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        mercadona: {
          green: "#00824B",
          orange: "#FFA100",
          yellow: "#FFC300",
        },
      },
      fontFamily: {
        "mercadona-logo": ["Frankfurter", "sans-serif"],
        "mercadona-text": ["Berliner", "sans-serif"],
      },
    },
  },
  plugins: [],
};
