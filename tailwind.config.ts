import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./lib/**/*.{js,ts,jsx,tsx,mdx}"
    ],
    theme: {
        extend: {
            colors: {
                background: "#060816",
                foreground: "#f8fafc",
                muted: "#94a3b8",
                card: "rgba(15, 23, 42, 0.72)",
                border: "rgba(148, 163, 184, 0.16)",
                primary: {
                    DEFAULT: "#7c3aed",
                    foreground: "#ffffff"
                },
                secondary: {
                    DEFAULT: "#0f172a",
                    foreground: "#e2e8f0"
                },
                accent: "#22d3ee"
            },
            backgroundImage: {
                "hero-radial": "radial-gradient(circle at top, rgba(124,58,237,0.35), transparent 35%), radial-gradient(circle at 80% 20%, rgba(34,211,238,0.20), transparent 30%)"
            },
            boxShadow: {
                glow: "0 0 0 1px rgba(255,255,255,0.04), 0 20px 60px rgba(76, 29, 149, 0.35)"
            },
            borderRadius: {
                xl2: "1.25rem"
            }
        }
    },
    plugins: []
};

export default config;
