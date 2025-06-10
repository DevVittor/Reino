/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        escuro: "#0C0C0C", // Um tom escuro (cinza bem escuro), mas você pode ajustar o valor
        laranja: "#FF9900",
        dourado: "#F3C623",
        outro_dourado: "#FFE99A",
        marrom: "#361500",
      },
    },
  },
  plugins: [],
};
