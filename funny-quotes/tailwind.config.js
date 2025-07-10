/** @type {import('tailwindcss').Config} */
export default {
	content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
	darkMode: 'class',
	theme: {
		extend: {
			animation: {
				'token-hover': 'token-hover 0.3s ease-out',
				'token-click': 'token-click 0.3s ease-out',
				'meter-fill': 'meter-fill 0.8s ease-out',
				'toast-up': 'toast-up 0.5s ease-out',
			},
			keyframes: {
				'token-hover': {
					'0%': { transform: 'translateY(0px)' },
					'100%': { transform: 'translateY(-2px)' },
				},
				'token-click': {
					'0%': { transform: 'scale(1)' },
					'25%': { transform: 'scale(0.9)' },
					'50%': { transform: 'scale(1.1)' },
					'100%': { transform: 'scale(1)' },
				},
				'meter-fill': {
					'0%': { width: '0%' },
					'100%': { width: 'var(--meter-width)' },
				},
				'toast-up': {
					'0%': { transform: 'translateY(100%)', opacity: 0 },
					'100%': { transform: 'translateY(0)', opacity: 1 },
				},
			},
			perspective: {
				1000: '1000px',
			},
			backdropBlur: {
				xs: '2px',
			},
		},
	},
};
