/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        abcdia: ["ABCDiatype", "sans-serif"],
        "abcdia-pixel": ["ABCDiatypePixel", "sans-serif"],
      },
      colors: {
        "custom-gray": "rgb(241, 243, 244)",
      },
    },
  },
  plugins: [],
};
