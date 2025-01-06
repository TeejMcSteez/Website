/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./public/*.{html,js}"],
  theme: {
    extend: {
      keyframes: {
        float: {
          '0%': { transform: 'translate(0, 0) scale(0.5)' },
          '50%': { transform: 'translate(100vw, 100vh) scale(1)' },
          '100%': { transform: 'translate(0, 0) scale(0.5)' },
        },
      },
      animation: {
        float: 'float 30s infinite ease-in-out',
      },
    },
  },
  plugins: [],
};
