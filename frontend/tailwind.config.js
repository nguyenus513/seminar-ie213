export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#070A12",
        panel: "#101522",
        line: "rgba(255,255,255,0.1)",
        accent: "#18E6A7",
        warn: "#F5B14C"
      },
      fontFamily: {
        sans: ["ui-sans-serif", "system-ui", "sans-serif"]
      }
    }
  },
  plugins: []
};
