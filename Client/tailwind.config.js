/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,jsx,tsx}"],
  theme: {
    extend: {
      fontWeight: {
        '100': 100,
        '200': 200,
        '300': 300,
        '400' : 40,
        '500': 500,
        '600' : 600,
        '700': 700,
      },
      width: {
        'cus': '40rem', 
      },
    },
  },
  plugins: [],
}

