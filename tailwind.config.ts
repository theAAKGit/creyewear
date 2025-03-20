import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: "#19333F",
        secondary: "#4B6B70",
        accent: "#34d399",
      },
      fontFamily: {
        ripple: ["Ripple", "sans-serif"],
      },
      spacing: {
        72: "18rem",
        84: "21rem",
        96: "24rem",
      },
      screens: {
        xs: "475px",
      },
      typography: {
        DEFAULT: {
          css: {
            ul: {
              listStyleType: "disc", // ✅ Force bullet points to display properly
              paddingLeft: "1.5rem",
            },
            ol: {
              listStyleType: "decimal",
              paddingLeft: "1.5rem",
            },
            li: {
              marginBottom: "0.25rem", // ✅ Adjust spacing between bullet points
            },
          },
        },
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("@tailwindcss/forms"),
  ],
} satisfies Config;

