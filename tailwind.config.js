/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'dark-toolbar': '#1f2c34',
        'dark-bg': '#121b22',
        'dark-green': '#01a984',
      },
    },
  },
  plugins: [],
};
