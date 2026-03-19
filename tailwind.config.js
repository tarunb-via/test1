/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef6ff',
          100: '#d9eaff',
          600: '#2563eb',
          700: '#1d4ed8',
          900: '#142b57',
        },
        accent: {
          50: '#ecfeff',
          600: '#0891b2',
          700: '#0f766e',
          800: '#155e75',
        },
        sand: {
          100: '#fff4db',
          700: '#9a6700',
          800: '#7c5200',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
