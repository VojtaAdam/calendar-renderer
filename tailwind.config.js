/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      gridTemplateRows: {
        '1': 'repeat(1, minmax(100px, 100px))',
        '2': 'repeat(2, minmax(100px, 100px))',
        '3': 'repeat(3, minmax(100px, 100px))',
        '4': 'repeat(4, minmax(100px, 100px))',
        '5': 'repeat(5, minmax(100px, 100px))',
        '6': 'repeat(6, minmax(100px, 100px))',
        '7': 'repeat(7, minmax(100px, 100px))',
        '8': 'repeat(8, minmax(100px, 100px))',
        '9': 'repeat(9, minmax(100px, 100px))',
        '10': 'repeat(10, minmax(100px, 100px))',
        '11': 'repeat(11, minmax(100px, 100px))',
        '12': 'repeat(12, minmax(100px, 100px))',
        '13': 'repeat(13, minmax(100px, 100px))',
      },
      gridRowStart: {
        '8': '8',
        '9': '9',
        '10': '10',
        '11': '11',
        '12': '12',
        '13': '13',
      },
      gridRowEnd: {
        '8': '8',
        '9': '9',
        '10': '10',
        '11': '11',
        '12': '12',
        '13': '13',
      },
    }
  },
  plugins: [],
}

