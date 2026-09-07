/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sakura: {
          50: '#fff5f7',
          100: '#ffe6ed',
          200: '#ffccd8',
          500: '#ff4d79',
          600: '#e62e5c',
        },
        indigo: {
          900: '#1e1b4b',
          950: '#0f0e26',
        }
      },
    },
  },
  plugins: [],
}
