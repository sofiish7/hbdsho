/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        space: {
          dark: '#050505',
          purple: '#2d004d',
          blue: '#001a33',
        },
        nebula: {
          pink: '#ff00ff',
          cyan: '#00ffff',
        }
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        twinkle: {
          '0%, 100%': { opacity: '0.3', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.2)' },
        },
        'shooting-star': {
          '0%': { transform: 'rotate(var(--angle)) scale(var(--scale)) translateX(0)', opacity: '0' },
          '10%': { opacity: '1' },
          '90%': { opacity: '1' },
          '100%': { transform: 'rotate(var(--angle)) scale(var(--scale)) translateX(1000px)', opacity: '0' },
        }
      },
      animation: {
        float: 'float 6s infinite ease-in-out',
        twinkle: 'twinkle var(--duration, 3s) infinite ease-in-out',
        'shooting-star': 'shooting-star var(--shooting-duration, 4s) linear forwards',
      }
    },
  },
  plugins: [],
}
