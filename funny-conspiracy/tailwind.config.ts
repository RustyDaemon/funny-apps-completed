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
				'fade-in': 'fadeIn 0.35s ease-in-out',
				'slide-up': 'slideUp 0.35s ease-in-out',
			},
			keyframes: {
				fadeIn: {
					'0%': { opacity: '0' },
					'100%': { opacity: '1' },
				},
				slideUp: {
					'0%': { opacity: '0', transform: 'translateY(20px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' },
				},
			},
		},
	},
	plugins: [],
} satisfies Config;
