// tailwind.config.js
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      fontFamily: {
        bevietnam: ['"Be Vietnam Pro"', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
        cubano: ['iCielBC_Cubano', "sans-serif"], // Định danh font
      },
    },
  },
  plugins: [],
};
