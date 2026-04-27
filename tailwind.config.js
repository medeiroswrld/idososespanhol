/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#2E7D5B',
        secondary: '#F5A623',
        background: {
          light: '#FDF9F3',
          dark: '#1C1C2E',
        },
        text: {
          light: '#1A1A2E',
          dark: '#F0EDE8',
        }
      },
      fontFamily: {
        heading: ['Lexend', 'sans-serif'],
        body: ['Atkinson Hyperlegible', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
