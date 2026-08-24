/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#eefbf7',
          100: '#d6f5ea',
          200: '#b0e9d6',
          300: '#7dd6bc',
          400: '#48baa0',
          500: '#22a085',
          600: '#15806b',
          700: '#126556',
          800: '#115047',
          900: '#0e423b',
          950: '#04261f',
        },
        accent: {
          50: '#fff8eb',
          100: '#feebc7',
          200: '#fdd889',
          300: '#fcbd4f',
          400: '#fb9d24',
          500: '#f57c0b',
          600: '#d95c06',
          700: '#b43e09',
          800: '#92300e',
          900: '#782810',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
        'scale-in': 'scaleIn 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
};
