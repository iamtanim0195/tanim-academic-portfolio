import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: "class",
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                accent: {
                    DEFAULT: "var(--accent)",
                    foreground: "#10120F",
                },
                primary: {
                    text: "var(--text-primary)",
                },
                secondary: {
                    text: "var(--text-secondary)",
                },
                border: {
                    subtle: "var(--border-subtle)",
                },
                surface: {
                    DEFAULT: "var(--surface)",
                    hover: "var(--surface-hover)",
                },
            },
            fontFamily: {
                mono: ["var(--font-geist-mono)", "monospace"],
            },
        },
    },
    plugins: [],
};

export default config;