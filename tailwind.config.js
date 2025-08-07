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
        // Palette TraducXion V2.5
        'traduc': {
          'violet': '#8b5cf6',
          'indigo': '#6366f1',
          'emerald': '#10b981',
          'red': '#ef4444',
          'slate-900': '#0f172a',
          'info-blue': '#93bbfe',
          'info-bg': 'rgba(59, 130, 246, 0.1)',
          'badge-ready-bg': '#d1fae5',
          'badge-ready-text': '#065f46',
          // Palette Beige
          'beige': {
            50: '#faf8f5',
            100: '#f5f0e6',
            200: '#ede4d3',
            300: '#e0d0b8',
            400: '#d4bc9d',
            500: '#c8a882',
            600: '#b89968',
            700: '#9a7d56',
            800: '#7d6347',
            900: '#604a36'
          }
        }
      }
    },
  },
  plugins: [],
  safelist: [
    {
      pattern: /beige/
    }
  ]
}