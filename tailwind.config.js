/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cosmic: '#0b0c1e',
        neonBlue: '#00ffff',
        neonPurple: '#8000ff',
      },
    },
  },
  plugins: [],
}