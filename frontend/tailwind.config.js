/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9f3',
          100: '#dcf2e4',
          200: '#bce5ce',
          300: '#8cd1ac',
          400: '#58b783',
          500: '#34a0e4',
          600: '#2d8bcc',
          700: '#266fa3',
          800: '#225784',
          900: '#1e476b',
        },
        wellness: {
          sage: '#9CAF88',
          lavender: '#B19CD9',
          cream: '#FAF7F0',
          terracotta: '#D4A574',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'blob': 'blob 7s infinite',
        'blob-delay': 'blob 7s infinite 2s',
      },
      keyframes: {
        blob: {
          '0%': {
            transform: 'translate(0px, 0px) scale(1)',
          },
          '33%': {
            transform: 'translate(30px, -50px) scale(1.1)',
          },
          '66%': {
            transform: 'translate(-20px, 20px) scale(0.9)',
          },
          '100%': {
            transform: 'translate(0px, 0px) scale(1)',
          },
        },
      },
    },
  },
  plugins: [],
}
