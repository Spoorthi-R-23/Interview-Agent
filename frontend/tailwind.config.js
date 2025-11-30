/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif']
      },
      colors: {
        brand: {
          DEFAULT: '#2563EB',
          light: '#60A5FA',
          dark: '#1D4ED8'
        }
      },
      boxShadow: {
        card: '0 20px 40px -24px rgba(37, 99, 235, 0.45)'
      }
    }
  },
  plugins: []
};
