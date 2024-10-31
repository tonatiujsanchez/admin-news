/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f0f9ff",
          100: "#e0f1fe",
          200: "#b9e4fe",
          300: "#7ccffd",
          400: "#36b9fa",
          500: "#0ca0eb",
          600: "#0086d4",
          700: "#0164a3",
          800: "#065586",
          900: "#0b476f",
        },
        secondary: {
          50: "#fff9ed",
          100: "#fef1d6",
          200: "#fddeab",
          300: "#fbc676",
          400: "#f8a33f",
          500: "#f58617",
          600: "#e66c10",
          700: "#bf520f",
          800: "#984114",
          900: "#7a3714",
          950: "#421a08",
        },
      }
    },
  },
  plugins: [],
}
