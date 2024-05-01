/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        light: ['Roboto-Light', 'sans-serif'],
        regular: ['Roboto-Regular', 'sans-serif'],
        medium: ['Roboto-Medium', 'sans-serif'],
        bold: ['Roboto-Bold', 'sans-serif']
      },
      colors: {
        primary: '#1979BB',
        secondary: '#017A9B',
        background: '#D9D9D9'
      }
    },
  },
  plugins: [],
}

