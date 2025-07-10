// Base emoji set
export const ALL_EMOJIS = [
	'🍎',
	'🍊',
	'🍋',
	'🍉',
	'🍓',
	'🍒',
	'🥝',
	'🍑',
	'🍇',
	'🍏',
	'🍐',
	'🍌',
	'🍍',
];

// Mode-specific emoji sets
export const EMOJIS_BY_MODE = {
	classic: ['🍋', '🍉', '🍓', '🍒'],
	grid3x3: ALL_EMOJIS.slice(0, 9),
	retro: ['🍎', '🍊', '🍋', '🍓', '🍒'],
	jackpot: ['🍎', '🍊', '🍋', '🍉', '🍓', '🍒', '🥝'],
};

export const INITIAL_COINS = 200;
export const SPIN_COST = 10;

// Win multipliers for different combinations - adjusted for easier wins
export const MULTIPLIERS = {
	normal: 5.5,
	dual: 12.0,
	fruits: {
		'🍎': 2.0, // Increased payouts across the board
		'🍊': 4.0,
		'🍋': 2.5,
		'🍉': 3.0,
		'🍓': 3.5,
		'🍒': 5.0, // Cherry still pays the most
		'🥝': 2.5,
		'🍑': 4.0,
	} as Record<string, number>,
	jackpot: {
		classic: 15,
		grid3x3: 50,
		retro: 20,
		jackpot: 150,
	} as Record<string, number>,
};

// Game mode definitions
export const GAME_MODES = {
	classic: {
		name: 'Classic',
		rows: 1,
		cols: 3,
		description: '3 reels, 1 payline',
	},
	grid3x3: {
		name: 'Grid 3×3',
		rows: 3,
		cols: 3,
		description: '9 reels, 8 paylines',
	},
	retro: {
		name: 'Retro',
		rows: 3,
		cols: 1,
		description: '1 reel, 3 stops',
	},
	jackpot: {
		name: 'Jackpot',
		rows: 1,
		cols: 5,
		description: '5 reels, progressive',
	},
};

export type GameMode = keyof typeof GAME_MODES;

// Storage keys for localStorage
export const STORAGE_KEYS = {
	COINS: 'emojiSlotsCoins',
	HISTORY: 'emojiSlotsHistory',
	TOTAL_GAMES: 'emojiSlotsTotalGames', // New key for total games played
	LAST_CLEANUP_CHECK: 'emojiSlotsLastCleanupCheck', // New key for tracking cleanup checks
};

// Maximum number of games to keep in history
export const MAX_HISTORY_SIZE = 50;

// Check cleanup after every X games
export const CLEANUP_CHECK_INTERVAL = 10;
