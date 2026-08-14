/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#12161B",
        paper: "#EEF1EE",
        "paper-raised": "#F7F9F7",
        pine: {
          DEFAULT: "#0B6E5D",
          dark: "#084F42",
          light: "#E4F0EC",
        },
        amber: {
          DEFAULT: "#D98E04",
          light: "#FBF0D9",
        },
        brick: {
          DEFAULT: "#B23A2E",
          light: "#F8E4E1",
        },
        slate: {
          muted: "#64707D",
          line: "#D8DED9",
        },
      },
      fontFamily: {
        display: ["Fraunces", "serif"],
        body: ["Inter", "sans-serif"],
        mono: ["IBM Plex Mono", "monospace"],
      },
      keyframes: {
        pulseRing: {
          "0%": { transform: "scale(0.9)", opacity: "0.7" },
          "70%": { transform: "scale(1.8)", opacity: "0" },
          "100%": { transform: "scale(1.8)", opacity: "0" },
        },
      },
      animation: {
        "pulse-ring": "pulseRing 1.8s cubic-bezier(0.2,0.6,0.4,1) infinite",
      },
    },
  },
  plugins: [],
};
