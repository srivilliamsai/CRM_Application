/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                primary: "#007AFF", // Apple Blue
                secondary: "#5856D6", // Apple Purple
                success: "#34C759", // Apple Green
                warning: "#FF9500", // Apple Orange
                danger: "#FF3B30", // Apple Red
                dark: "#000000", // Pitch Black
                card: "#2C2C2E", // Apple Dark Card
                light: "#F2F2F7", // Apple Light Background
            },
            fontFamily: {
                sans: [
                    "Inter",
                    "-apple-system",
                    "BlinkMacSystemFont",
                    "Segoe UI",
                    "Roboto",
                    "Helvetica Neue",
                    "Arial",
                    "sans-serif",
                ],
            },
            backdropBlur: {
                xs: '2px',
            },
            animation: {
                marquee: 'marquee 25s linear infinite',
            },
            keyframes: {
                marquee: {
                    '0%': { transform: 'translateX(0%)' },
                    '100%': { transform: 'translateX(-100%)' },
                }
            }
        },
    },
    plugins: [],
}
