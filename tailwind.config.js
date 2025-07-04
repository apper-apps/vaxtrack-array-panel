/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2563EB',
        secondary: '#0F172A',
        accent: '#10B981',
        surface: '#F8FAFC',
        success: '#22C55E',
        warning: '#F59E0B',
        error: '#EF4444',
        info: '#3B82F6'
      },
      fontFamily: {
        'display': ['Inter', 'sans-serif'],
        'body': ['Inter', 'sans-serif']
      },
      animation: {
        'shimmer': 'shimmer 2s ease-in-out infinite alternate',
        'pulse-subtle': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { background: 'linear-gradient(110deg, #e2e8f0 0%, #f1f5f9 50%, #e2e8f0 100%)' },
          '100%': { background: 'linear-gradient(110deg, #f1f5f9 0%, #e2e8f0 50%, #f1f5f9 100%)' }
        }
      }
    },
  },
  plugins: [],
}