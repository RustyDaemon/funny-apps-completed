/**
 * Application constants and configuration
 */

export const SPINNER_CONFIG = {
	MIN_ITEMS: 2,
	MAX_ITEMS: 10,
	MIN_DURATION: 5000, // 5 seconds
	MAX_DURATION: 10000, // 10 seconds
	RESET_DELAY: 100, // ms
	CENTER_RADIUS: 25,
	WHEEL_RADIUS: 150,
	TEXT_RADIUS: 100,
	CENTER_X: 160,
	CENTER_Y: 160,
	VIEWBOX_SIZE: 320,
} as const;

export const VALIDATION_MESSAGES = {
	EMPTY_QUESTION: 'Please enter a question',
	EMPTY_ITEMS: 'Please fill in all option fields',
	MIN_ITEMS: `Please add at least ${SPINNER_CONFIG.MIN_ITEMS} options`,
	DUPLICATE_ITEMS: 'All options must be unique',
} as const;

export const UI_TEXT = {
	SPIN: 'SPIN!',
	SPIN_AGAIN: 'SPIN AGAIN!',
	SPINNING: 'Spinning...',
	BACK: '← Back',
	START_OVER: '← Start Over',
	WINNER_TITLE: '🎉 Winner! 🎉',
} as const;

export const DEFAULT_COLORS = [
	'#FF6B6B',
	'#4ECDC4',
	'#45B7D1',
	'#96CEB4',
	'#FFEAA7',
	'#DDA0DD',
	'#98D8C8',
	'#F7DC6F',
	'#BB8FCE',
	'#85C1E9',
] as const;

export const THEME_STYLES = {
	backgrounds: {
		light: 'bg-gradient-to-br from-purple-50 to-blue-100',
		dark: 'bg-gradient-to-br from-gray-900 to-blue-900',
	},
	cards: {
		light: 'bg-white text-gray-800 border-white/20',
		dark: 'bg-gray-800 text-gray-100 border-gray-700/50',
	},
	text: {
		primary: {
			light: 'text-gray-800',
			dark: 'text-gray-100',
		},
		secondary: {
			light: 'text-gray-600',
			dark: 'text-gray-300',
		},
	},
	borders: {
		light: 'border-gray-200',
		dark: 'border-gray-600',
	},
	buttons: {
		primary: {
			light: 'bg-gradient-to-r from-purple-500 to-blue-500',
			dark: 'bg-gradient-to-r from-purple-600 to-blue-600',
		},
		secondary: {
			light: 'bg-white/70 text-gray-700 border border-gray-200',
			dark: 'bg-gray-700/70 text-gray-200 border border-gray-600',
		},
	},
	hovers: {
		light: 'bg-gray-100',
		dark: 'bg-gray-700',
	},
} as const;

export const ANIMATION_CONFIG = {
	spring: {
		type: 'spring',
		stiffness: 300,
		damping: 30,
	},
	smooth: {
		duration: 0.3,
		ease: 'easeInOut',
	},
	bounce: {
		type: 'spring',
		stiffness: 500,
		damping: 15,
	},
} as const;
