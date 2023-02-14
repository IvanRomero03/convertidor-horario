/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      "animate-slow": "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
    },
  },
  plugins: [],
};
