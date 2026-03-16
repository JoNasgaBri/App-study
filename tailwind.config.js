/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      transitionTimingFunction: {
        'spring':   'cubic-bezier(0.34, 1.56, 0.64, 1)',
        'expo-out': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'expo-in':  'cubic-bezier(0.7, 0, 0.84, 0)',
      },
      keyframes: {
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          from: { opacity: '0', transform: 'scale(0.94)' },
          to:   { opacity: '1', transform: 'scale(1)' },
        },
        'popover-up': {
          from: { opacity: '0', transform: 'translateY(10px) scale(0.97)' },
          to:   { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        'slide-left': {
          from: { opacity: '0', transform: 'translateX(-10px)' },
          to:   { opacity: '1', transform: 'translateX(0)' },
        },
      },
      animation: {
        'fade-up':    'fade-up    220ms cubic-bezier(0.16, 1, 0.3, 1) both',
        'scale-in':   'scale-in   180ms cubic-bezier(0.16, 1, 0.3, 1) both',
        'popover-up': 'popover-up 200ms cubic-bezier(0.16, 1, 0.3, 1) both',
        'slide-left': 'slide-left 200ms cubic-bezier(0.16, 1, 0.3, 1) both',
      },
    },
  },
  plugins: [],
}