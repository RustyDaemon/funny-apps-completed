import { INITIAL_COINS, STORAGE_KEYS } from '../constants/gameConstants';
import type { GameResult, GameState } from '../types/gameTypes';

// Load game state from localStorage
export const loadGameState = (): GameState => {
	try {
		// Load coins
		const savedCoins = localStorage.getItem(STORAGE_KEYS.COINS);
		const coins = savedCoins ? parseInt(savedCoins, 10) : INITIAL_COINS;

		// Load game history
		const savedHistory = localStorage.getItem(STORAGE_KEYS.HISTORY);
		const gameHistory: GameResult[] = savedHistory
			? JSON.parse(savedHistory).map(
					(game: Omit<GameResult, 'timestamp'> & { timestamp: string }) => ({
						...game,
						timestamp: new Date(game.timestamp),
					})
			  )
			: [];

		// Load total games played
		const savedTotalGames = localStorage.getItem(STORAGE_KEYS.TOTAL_GAMES);
		const totalGamesPlayed = savedTotalGames
			? parseInt(savedTotalGames, 10)
			: 0;

		// Load last cleanup check
		const savedLastCleanupCheck = localStorage.getItem(
			STORAGE_KEYS.LAST_CLEANUP_CHECK
		);
		const lastCleanupCheck = savedLastCleanupCheck
			? parseInt(savedLastCleanupCheck, 10)
			: 0;

		return { coins, gameHistory, totalGamesPlayed, lastCleanupCheck };
	} catch (error) {
		console.error('Error loading game state:', error);
		return {
			coins: INITIAL_COINS,
			gameHistory: [],
			totalGamesPlayed: 0,
			lastCleanupCheck: 0,
		};
	}
};

// Save coins to localStorage
export const saveCoins = (coins: number): void => {
	localStorage.setItem(STORAGE_KEYS.COINS, coins.toString());
};

// Save game history to localStorage
export const saveGameHistory = (history: GameResult[]): void => {
	localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
};

// Save total games played to localStorage
export const saveTotalGames = (total: number): void => {
	localStorage.setItem(STORAGE_KEYS.TOTAL_GAMES, total.toString());
};

// Save last cleanup check to localStorage
export const saveLastCleanupCheck = (value: number): void => {
	localStorage.setItem(STORAGE_KEYS.LAST_CLEANUP_CHECK, value.toString());
};

// Reset all game data in localStorage
export const resetGameData = (): void => {
	localStorage.removeItem(STORAGE_KEYS.COINS);
	localStorage.removeItem(STORAGE_KEYS.HISTORY);
	localStorage.removeItem(STORAGE_KEYS.TOTAL_GAMES);
	localStorage.removeItem(STORAGE_KEYS.LAST_CLEANUP_CHECK);
};
