/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f1f8f4',
          100: '#def0e4',
          500: '#4caf50',
          600: '#3f9844',
          700: '#2f7d32',
        },
      },
    },
  },
  plugins: [],
}
