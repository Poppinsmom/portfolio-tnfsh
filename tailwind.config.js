/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        poppins: {
          blue: "#0071e3",
          sky: "#f7f9ff",
          ink: "#1d1d1f",
          muted: "#6e6e73",
          line: "#d8e0ee"
        }
      },
      boxShadow: {
        card: "0 18px 45px rgba(45, 72, 124, 0.10)"
      }
    }
  },
  plugins: []
};
