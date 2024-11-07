/** @type {import('tailwindcss').Config} */
const plugin = require('tailwindcss/plugin')

export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}",],
  theme: {
    extend: {},
    fontFamily: {
      bkel: "Century Gothic, Arial, Helvetica, sans-serif",
    }
  },
  plugins: [
    plugin(function ({ addUtilities }) {
      addUtilities({
        '.scrollbar-hide': {
          /* IE and Edge */
          '-ms-overflow-style': 'none',
    
          /* Firefox */
          'scrollbar-width': 'none',
    
          /* Safari and Chrome */
          '&::-webkit-scrollbar': {
            display: 'none'
          }
        },
        
        '.scrollbar-default': {
          /* IE and Edge */
          '-ms-overflow-style': 'auto',
    
          /* Firefox */
          'scrollbar-width': 'auto',
    
          /* Safari and Chrome */
          '&::-webkit-scrollbar': {
            display: 'block'
          }
        }
      }, ['responsive'])
    })
  ],
}

