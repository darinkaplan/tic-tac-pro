/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        atsf: {
          navy: '#103B73',
          'navy-dark': '#0B2A52',
          'navy-light': '#1E5BA8',
          gold: '#D4A017',
          'gold-light': '#E8C155',
          cream: '#F5F1E8',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
