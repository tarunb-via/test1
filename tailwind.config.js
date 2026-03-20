/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef8ff',
          100: '#d9efff',
          300: '#7bc8ff',
          500: '#2f8cff',
          600: '#1f6fe0',
          700: '#1b57b0',
        },
        accent: {
          50: '#ecfdf7',
          500: '#14b88a',
          700: '#0f766e',
        },
        sunset: {
          50: '#fff4eb',
          500: '#ff9b54',
          700: '#c96a2b',
        },
        cream: {
          50: '#f8faf8',
          100: '#eef3f1',
        },
      },
      boxShadow: {
        soft: '0 18px 45px rgba(15, 23, 42, 0.08)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
