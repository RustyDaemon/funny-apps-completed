import type { GameMode } from '../constants/gameConstants';

export type GameResult = {
	timestamp: Date;
	mode: GameMode;
	reels: string[][];
	isJackpot: boolean;
	coinsWon: number;
	multiplier: number;
};

export type GameState = {
	coins: number;
	gameHistory: GameResult[];
	totalGamesPlayed: number;
	lastCleanupCheck: number;
};

export type PopupState = {
	showFreeCoinsPopup: boolean;
	showCleanupPopup: boolean;
	showClearDataPopup: boolean;
	freeCoinsAmount: number;
};
