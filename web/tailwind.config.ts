import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class", '[data-theme="dark"]'],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Semantic background / text
        "bg-page": "var(--bg-page)",
        "bg-elevated": "var(--bg-elevated)",
        "bg-subtle": "var(--bg-subtle)",
        "bg-interactive": "var(--bg-interactive)",

        "border-subtle": "var(--border-subtle)",
        "border-strong": "var(--border-strong)",

        "text-primary": "var(--text-primary)",
        "text-secondary": "var(--text-secondary)",
        "text-muted": "var(--text-muted)",

        primary: "var(--color-primary)",
        secondary: "var(--color-secondary)",
        accent: "var(--color-accent)",

        success: "var(--color-success)",
        warning: "var(--color-warning)",
        danger: "var(--color-danger)",
      },
      boxShadow: {
        soft: "var(--shadow-soft)",
        strong: "var(--shadow-strong)",
      },
      borderRadius: {
        sm: "6px",
        md: "12px",
        lg: "18px",
      },
    },
  },
  plugins: [],
};

export default config;

