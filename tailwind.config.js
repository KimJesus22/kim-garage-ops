/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // COD MW Dark Backgrounds
                'cod-dark': '#0b0e11', // Requested: cod-darker base, using as dark
                'cod-darker': '#0b0e11', // Requested specific hex
                'cod-panel': '#151a21', // Requested specific hex
                'cod-panel-light': '#1e252f', // Generated variant

                // Neon Green Accents
                'neon-green': '#4ade80', // Requested specific hex
                'neon-green-dark': '#22c55e', // Generated variant
                'neon-green-glow': 'rgba(74, 222, 128, 0.3)',

                // Orange Accents
                'cod-orange': '#ff6b35', // Requested specific hex
                'cod-orange-light': '#ff8c42',
                'cod-orange-glow': 'rgba(255, 107, 53, 0.3)',

                // Grays for borders and text
                'cod-gray': '#2a3b47', // Using requested border color as base gray
                'cod-gray-light': '#4a5568',
                'cod-text': '#e2e8f0',
                'cod-text-dim': '#94a3b8',
                'cod-border': '#2a3b47', // Requested specific hex
                'cod-border-light': '#374b5c',
            },
            fontFamily: {
                'sans': ['Inter', 'Rajdhani', 'system-ui', 'sans-serif'],
                'display': ['Rajdhani', 'Inter', 'sans-serif'],
            },
            boxShadow: {
                'neon-green': '0 0 10px rgba(74, 222, 128, 0.3), 0 0 20px rgba(74, 222, 128, 0.1)',
                'neon-orange': '0 0 10px rgba(255, 107, 53, 0.3), 0 0 20px rgba(255, 107, 53, 0.1)',
                'cod-card': '0 4px 6px rgba(0, 0, 0, 0.3), 0 0 1px rgba(255, 255, 255, 0.1)',
            },
            animation: {
                'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
            },
            keyframes: {
                'glow-pulse': {
                    '0%, 100%': { boxShadow: '0 0 5px rgba(74, 222, 128, 0.2)' },
                    '50%': { boxShadow: '0 0 20px rgba(74, 222, 128, 0.4)' },
                },
            },
        },
    },
    plugins: [],
}
