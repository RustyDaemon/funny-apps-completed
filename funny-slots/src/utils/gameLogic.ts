import type { GameMode } from '../constants/gameConstants';
import {
	EMOJIS_BY_MODE,
	GAME_MODES,
	MULTIPLIERS,
	SPIN_COST,
} from '../constants/gameConstants';
import type { GameResult } from '../types/gameTypes';

// Initialize reels for a given game mode
export const initReels = (mode: GameMode): string[][] => {
	const { rows, cols } = GAME_MODES[mode];
	const currentEmojis = EMOJIS_BY_MODE[mode];
	const newReels: string[][] = [];

	for (let r = 0; r < rows; r++) {
		const rowReels: string[] = [];
		for (let c = 0; c < cols; c++) {
			const randomIndex = Math.floor(Math.random() * currentEmojis.length);
			rowReels.push(currentEmojis[randomIndex]);
		}
		newReels.push(rowReels);
	}

	return newReels;
};

// Generate random reels during spinning
export const generateRandomReels = (mode: GameMode): string[][] => {
	return initReels(mode);
};

// Generate the final reels result
export const generateFinalReels = (mode: GameMode): string[][] => {
	return initReels(mode);
};

// Check if the reels result is a jackpot
export const checkJackpot = (
	mode: GameMode,
	finalReels: string[][]
): boolean => {
	switch (mode) {
		case 'classic': {
			// All 3 symbols match in a row
			return finalReels[0].every(e => e === finalReels[0][0]);
		}
		case 'grid3x3': {
			// Any row or column or diagonal has all matching symbols
			const row0Match = finalReels[0].every(e => e === finalReels[0][0]);
			const row1Match = finalReels[1].every(e => e === finalReels[1][0]);
			const row2Match = finalReels[2].every(e => e === finalReels[2][0]);

			const col0Match =
				finalReels[0][0] === finalReels[1][0] &&
				finalReels[1][0] === finalReels[2][0];
			const col1Match =
				finalReels[0][1] === finalReels[1][1] &&
				finalReels[1][1] === finalReels[2][1];
			const col2Match =
				finalReels[0][2] === finalReels[1][2] &&
				finalReels[1][2] === finalReels[2][2];

			const diag1Match =
				finalReels[0][0] === finalReels[1][1] &&
				finalReels[1][1] === finalReels[2][2];
			const diag2Match =
				finalReels[0][2] === finalReels[1][1] &&
				finalReels[1][1] === finalReels[2][0];

			return (
				row0Match ||
				row1Match ||
				row2Match ||
				col0Match ||
				col1Match ||
				col2Match ||
				diag1Match ||
				diag2Match
			);
		}
		case 'retro': {
			// All 3 symbols in the column match
			return (
				finalReels[0][0] === finalReels[1][0] &&
				finalReels[1][0] === finalReels[2][0]
			);
		}
		case 'jackpot': {
			// All 5 symbols in a row must match
			return finalReels[0].every(e => e === finalReels[0][0]);
		}
	}
};

// Calculate the win amount and return updated game result
export const calculateWinnings = (
	mode: GameMode,
	finalReels: string[][],
	hasJackpot: boolean
): { coinsWon: number; multiplier: number } => {
	if (hasJackpot) {
		// Jackpot wins
		const winAmount = Math.floor(MULTIPLIERS.jackpot[mode] * SPIN_COST);
		return { coinsWon: winAmount, multiplier: MULTIPLIERS.jackpot[mode] };
	} else if (mode === 'grid3x3') {
		// Special handling for grid mode - count matching patterns
		const row0Match = finalReels[0].every(e => e === finalReels[0][0]);
		const row1Match = finalReels[1].every(e => e === finalReels[1][0]);
		const row2Match = finalReels[2].every(e => e === finalReels[2][0]);

		const col0Match =
			finalReels[0][0] === finalReels[1][0] &&
			finalReels[1][0] === finalReels[2][0];
		const col1Match =
			finalReels[0][1] === finalReels[1][1] &&
			finalReels[1][1] === finalReels[2][1];
		const col2Match =
			finalReels[0][2] === finalReels[1][2] &&
			finalReels[1][2] === finalReels[2][2];

		const matchCount = [
			row0Match,
			row1Match,
			row2Match,
			col0Match,
			col1Match,
			col2Match,
		].filter(Boolean).length;

		if (matchCount === 1) {
			// Single line match
			const winAmount = Math.floor(MULTIPLIERS.normal * SPIN_COST);
			return { coinsWon: winAmount, multiplier: MULTIPLIERS.normal };
		} else if (matchCount >= 2) {
			// Multiple line matches
			const multiplier = MULTIPLIERS.dual * matchCount;
			const winAmount = Math.floor(multiplier * SPIN_COST);
			return { coinsWon: winAmount, multiplier };
		}
	} else {
		// Regular wins for other modes
		const firstSymbol = finalReels[0][0];
		const isFruitWin = finalReels.some(row =>
			row.length > 1
				? row.every(e => e === firstSymbol)
				: row[0] === firstSymbol
		);

		if (isFruitWin && MULTIPLIERS.fruits[firstSymbol]) {
			const winAmount = Math.floor(MULTIPLIERS.fruits[firstSymbol] * SPIN_COST);
			return {
				coinsWon: winAmount,
				multiplier: MULTIPLIERS.fruits[firstSymbol],
			};
		}
	}

	return { coinsWon: 0, multiplier: 0 };
};

// Create a new game result based on the spin outcome
export const createGameResult = (
	mode: GameMode,
	reels: string[][],
	isJackpot: boolean,
	coinsWon: number,
	multiplier: number
): GameResult => {
	return {
		timestamp: new Date(),
		mode,
		reels,
		isJackpot,
		coinsWon,
		multiplier,
	};
};
