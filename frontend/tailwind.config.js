/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class", // ✅ Ensures dark mode works by toggling "dark" class
  theme: {
    extend: {
      screens: {
        sm: "576px",
        md: "768px",
        lg: "992px",
        xl: "1220px",
        xxl: "1400px",
      },
      fontFamily: {
        cab: ["Cabinet", "sans-serif"],
        "open-sans": ["Open Sans", "sans-serif"],
      },
      colors: {
        "dark-bg": "#141517",
        "light-bg": "#F5F5F5",
        primary: "#ED6A22",
        "subtle-gray": "#E5E7EB",
        "custom-black": "#000000",
        "custom-dark": "#1d1e1f",
      },
      backgroundImage: {
        "bg-lg": "url('/images/line.svg')",
        "bg-sm": "url('/images/mobile-line.svg')",
      },
    },
  },
  plugins: [],
};
