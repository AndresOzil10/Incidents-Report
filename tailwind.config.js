/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html","./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        'background' : "url('../src/assets/images/banner.jpg')",
        'fondo': "url('../src/assets/images/fondo.jpg')",
      },
      colors: {
        "dark-purple": "#3e838c",
        'light-white': 'rgba(255, 255,255,0.18)',
        "bg-color": "#c2b79b",
        "bg-form": "#8b9e9b",
      }
    },
  },
  plugins: [],
}

