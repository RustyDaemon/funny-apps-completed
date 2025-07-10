import type { Config } from 'tailwindcss';

export default {
	content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
	darkMode: 'class',
	theme: {
		extend: {
			fontFamily: {
				mono: [
					'ui-monospace',
					'SFMono-Regular',
					'Monaco',
					'Consolas',
					'Liberation Mono',
					'Courier New',
					'monospace',
				],
			},
			animation: {
				wiggle: 'wiggle 0.5s ease-in-out',
				'scale-spring': 'scale-spring 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
			},
			keyframes: {
				wiggle: {
					'0%, 100%': { transform: 'rotate(0deg)' },
					'25%': { transform: 'rotate(-5deg)' },
					'75%': { transform: 'rotate(5deg)' },
				},
				'scale-spring': {
					'0%': { transform: 'scale(0.8)' },
					'100%': { transform: 'scale(1)' },
				},
			},
		},
	},
	plugins: [],
} satisfies Config;
