import type { Config } from 'tailwindcss';

export default {
	content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
	darkMode: 'class',
	theme: {
		extend: {
			animation: {
				'float-up': 'float-up 5s linear forwards',
				sway: 'sway 5s ease-in-out infinite',
			},
			keyframes: {
				'float-up': {
					'0%': { transform: 'translateY(0px)' },
					'100%': { transform: 'translateY(-100vh)' },
				},
				sway: {
					'0%, 100%': { transform: 'translateX(0px)' },
					'25%': { transform: 'translateX(10px)' },
					'75%': { transform: 'translateX(-10px)' },
				},
			},
		},
	},
	plugins: [],
} satisfies Config;
