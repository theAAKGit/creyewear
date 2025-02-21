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
        background: "var(--background)", // Custom CSS variables
        foreground: "var(--foreground)", // Custom CSS variables
        primary: "#19333F", // Add primary color
        secondary: "#4B6B70", // Add secondary color
        accent: "#34d399", // Accent color for buttons or highlights
        lilac: "#dc56e0",
      },
      fontFamily: {
        sans: ['Arial', 'Helvetica', 'sans-serif'], // Default sans-serif stack
        serif: ['Georgia', 'serif'], // Default serif stack
        mono: ['Courier New', 'monospace'], // Default monospace stack
      },
      spacing: {
        72: "18rem", // Custom spacing value
        84: "21rem", // Custom spacing value
        96: "24rem", // Custom spacing value
      },
      screens: {
        'xs': '475px', // Extra small screens for finer control
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"), // For blog styling
    require("@tailwindcss/forms"), // For better form styles
  ],
} satisfies Config;
