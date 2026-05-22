/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        atsf: {
          // Notebook Cream — light theme tokens
          paper: '#F7F2E6',          // page background (warm cream)
          parchment: '#ECE4D0',      // big-board panel (slightly deeper cream)
          surface: '#FFFFFF',        // cells + small-board surface (white)
          'surface-hover': '#F2EAD4',// cell hover (warm)
          rule: '#E5DCC2',           // hairline borders inside cells
          border: '#D6CCB0',         // outer small-board border
          ink: '#1B3A6B',            // primary text + X piece + secondary button (navy)
          'ink-muted': '#6B7896',    // secondary text (computed muted navy)
          gold: '#B8860B',           // headline, O piece, primary button (deep gold)
          'gold-light': '#D4A017',   // primary button hover (brighter gold)
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
