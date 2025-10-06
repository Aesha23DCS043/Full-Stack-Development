/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: { colors: {
        silverfox: '#b8b1a9',
        seahaze: '#b4b9ae',
        heathergray: '#a6afa3',
        bachelorblue: '#778e9b',
        oceanfloor: '#626b73',
        eveningdove: '#49505a',
      }
    },
  },
  plugins: [],
}

