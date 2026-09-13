/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        red: {
          primary: '#f9004d',
          dark: '#c41020',
          hover: '#e0192c',
        },
        dark: {
          DEFAULT: '#0d0d0d',
          2: '#111111',
          3: '#1a1a1a',
          4: '#222222',
        },
        gray: {
          DEFAULT: '#777777',
          2: '#999999',
        },
        light: {
          DEFAULT: '#f7f7f7',
          2: '#f0f0f0',
        },
        border: '#e5e5e5',
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
      fontSize: {
        '13px': '13px',
        '14px': '14px',
        '15px': '15px',
        '16px': '16px',
      },
      lineHeight: {
        '1.7': '1.7',
        '1.75': '1.75',
        '1.8': '1.8',
      },
      boxShadow: {
        card: '0 10px 40px rgba(0,0,0,0.10)',
        'card-dark': '0 10px 40px rgba(0,0,0,0.25)',
        'card-hover': '0 20px 50px rgba(0,0,0,0.15)',
        'red': '0 8px 25px rgba(232,25,44,0.35)',
        'img': '0 16px 48px rgba(0,0,0,0.12)',
        'badge': '0 10px 40px rgba(0,0,0,0.3)',
        'header': '0 2px 20px rgba(0,0,0,0.3)',
        'btn-contact': '0 0 0 3px rgba(232,25,44,0.08)',
      },
      keyframes: {
        marquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        },
        marqueeReverse: {
          from: { transform: 'translateX(-50%)' },
          to: { transform: 'translateX(0)' },
        },
        spin: {
          to: { transform: 'rotate(360deg)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
      },
      animation: {
        marquee: 'marquee 20s linear infinite',
        'marquee-reverse': 'marqueeReverse 22s linear infinite',
        spin: 'spin 0.8s linear infinite',
      },
      transitionTimingFunction: {
        'cubic': 'cubic-bezier(0.77,0,0.175,1)',
      },
    },
  },
  plugins: [],
}
