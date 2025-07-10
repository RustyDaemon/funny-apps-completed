/** @type {import('tailwindcss').Config} */
export default {
	darkMode: 'class',
	content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
	theme: {
		extend: {
			backgroundImage: {
				'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
			},
			animation: {
				'quantum-glitch': 'quantum-glitch 0.6s ease-in-out',
				'dice-roll': 'dice-roll 2s ease-out infinite',
				'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
				'slide-right': 'slide-right 2s ease-in-out infinite',
				'particle-drift': 'particle-drift 3s linear infinite',
				'glitch-background':
					'glitch-background 0.8s cubic-bezier(0.4, 0, 0.6, 1) infinite',
			},
			keyframes: {
				'quantum-glitch': {
					'0%, 100%': {
						transform: 'scale(1) rotate(0deg)',
						filter: 'hue-rotate(0deg) brightness(1)',
					},
					'20%': {
						transform: 'scale(1.1) rotate(-2deg)',
						filter: 'hue-rotate(90deg) brightness(1.2)',
					},
					'40%': {
						transform: 'scale(0.9) rotate(2deg)',
						filter: 'hue-rotate(180deg) brightness(0.8)',
					},
					'60%': {
						transform: 'scale(1.05) rotate(-1deg)',
						filter: 'hue-rotate(270deg) brightness(1.1)',
					},
					'80%': {
						transform: 'scale(0.95) rotate(1deg)',
						filter: 'hue-rotate(360deg) brightness(0.9)',
					},
				},
				'slide-right': {
					'0%, 100%': {
						transform: 'translateX(-100%)',
					},
					'50%': {
						transform: 'translateX(100%)',
					},
				},
				'glitch-background': {
					'0%, 100%': {
						backgroundPosition: '0% 0%, 0% 0%',
						transform: 'scale(1) rotate(0deg)',
					},
					'25%': {
						backgroundPosition: '100% 0%, 0% 100%',
						transform: 'scale(1.02) rotate(1deg)',
					},
					'50%': {
						backgroundPosition: '100% 100%, 100% 0%',
						transform: 'scale(0.98) rotate(-1deg)',
					},
					'75%': {
						backgroundPosition: '0% 100%, 100% 100%',
						transform: 'scale(1.02) rotate(0.5deg)',
					},
				},
				'particle-drift': {
					'0%': {
						maskPosition: '0px 0px',
					},
					'100%': {
						maskPosition: '100px 100px',
					},
				},
				'dice-roll': {
					'0%': {
						transform: 'rotateX(0deg) rotateY(0deg) rotateZ(0deg) scale(1)',
					},
					'25%': {
						transform:
							'rotateX(90deg) rotateY(180deg) rotateZ(90deg) scale(1.05)',
					},
					'50%': {
						transform:
							'rotateX(180deg) rotateY(360deg) rotateZ(180deg) scale(0.95)',
					},
					'75%': {
						transform:
							'rotateX(270deg) rotateY(540deg) rotateZ(270deg) scale(1.05)',
					},
					'100%': {
						transform:
							'rotateX(360deg) rotateY(720deg) rotateZ(360deg) scale(1)',
					},
				},
				'pulse-glow': {
					'0%, 100%': {
						boxShadow: '0 0 20px rgba(139, 92, 246, 0.3)',
						transform: 'scale(1)',
					},
					'50%': {
						boxShadow: '0 0 40px rgba(139, 92, 246, 0.6)',
						transform: 'scale(1.02)',
					},
				},
			},
		},
	},
	plugins: [],
};
