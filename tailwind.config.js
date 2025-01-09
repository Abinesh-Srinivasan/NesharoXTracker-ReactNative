/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        'rubik-regular':['rubik-regular'],
        'rubik-medium':['rubik-medium'],
        'rubik-light':['rubik-light'],
        'rubik-bold':['rubik-bold'],
        'rubik-semibold':['rubik-semibold'],
        'rubik-extrabold':['rubik-extrabold'],
      }
    },
  },
  plugins: [],
};
