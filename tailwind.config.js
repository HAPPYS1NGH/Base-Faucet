/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    colors: {
      blue: "#0052ff",
      white: "#FFFFFF",
      red: "#FF0000",
      orange: "#FFA500",
      green: "#008000",
      yellow: "#FFFF00",
    },

    extend: {
      // keyframes: {
      //   "slide-left": {
      //     "0%": { transform: "translateX(-100%)" },
      //     "100%": { transform: "translateX(100%);" },
      //   },
      // },
      // animation: {
      //   animation: "slide-left 4s infinite",
      // },
      width: {
        100: "450px",
      },
      borderWidth: {
        3: "3px",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
