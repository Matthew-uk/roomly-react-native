/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      fontFamily: {
        regular: ['Urbanist-Regular'],
        medium: ['Urbanist-Semibold'],
        bold: ['Urbanist-Bold'],
      },
      colors: {
        primary: {
          DEFAULT: '#636AE8', // Blue 800
          light: '#3B82F6', // Blue 500
          dark: '#1E3A8A', // Blue 900
        },
        secondary: {
          DEFAULT: '#F59E0B', // Amber 600
          light: '#FCD34D', // Amber 400
          dark: '#B45309', // Amber 800
        },
      },
    },
  },
  plugins: [],
};
