/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
            colors: {
                // Warm hospital palette
                surface: {
                    50:  '#fafbfc',
                    100: '#f4f6f8',
                    200: '#eef1f5',
                    300: '#e2e7ed',
                    400: '#cdd5de',
                },
                primary: {
                    50:  '#eef9f7',
                    100: '#d0f0eb',
                    200: '#a3e0d7',
                    300: '#6cc9bc',
                    400: '#4db8a9',
                    500: '#2a9d8f',
                    600: '#238778',
                    700: '#1d6e63',
                    800: '#175750',
                    900: '#12453f',
                },
                warm: {
                    50:  '#fef7f0',
                    100: '#fdebd4',
                    200: '#fbd5a8',
                    300: '#f7b76e',
                    400: '#f4a261',
                    500: '#e08a3a',
                },
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-15px)' },
                },
                slideUp: {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                slideRight: {
                    '0%': { opacity: '0', transform: 'translateX(-20px)' },
                    '100%': { opacity: '1', transform: 'translateX(0)' },
                },
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                'scale-in': {
                    '0%': { opacity: '0', transform: 'scale(0.95)' },
                    '100%': { opacity: '1', transform: 'scale(1)' },
                },
                'gentle-pulse': {
                    '0%, 100%': { opacity: '0.6' },
                    '50%': { opacity: '1' },
                },
                'blob': {
                    '0%, 100%': { borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%' },
                    '50%': { borderRadius: '30% 60% 70% 40% / 50% 60% 30% 60%' },
                },
            },
            animation: {
                'float': 'float 6s ease-in-out infinite',
                'slide-up': 'slideUp 0.5s ease-out forwards',
                'slide-right': 'slideRight 0.4s ease-out forwards',
                'fade-in': 'fadeIn 0.4s ease-out forwards',
                'scale-in': 'scale-in 0.35s ease-out forwards',
                'gentle-pulse': 'gentle-pulse 3s ease-in-out infinite',
                'blob': 'blob 10s ease-in-out infinite',
            },
            boxShadow: {
                'soft': '0 2px 15px -3px rgba(0,0,0,0.07), 0 10px 20px -2px rgba(0,0,0,0.04)',
                'card': '0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)',
                'elevated': '0 4px 25px -5px rgba(0,0,0,0.08), 0 10px 30px -5px rgba(0,0,0,0.04)',
                'glow-teal': '0 4px 20px -4px rgba(42, 157, 143, 0.25)',
            },
        },
    },
    plugins: [],
}