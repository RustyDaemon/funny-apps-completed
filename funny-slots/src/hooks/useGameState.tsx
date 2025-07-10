import confetti from 'canvas-confetti';
import { useCallback, useEffect, useState } from 'react';
import type { GameMode } from '../constants/gameConstants';
import {
	CLEANUP_CHECK_INTERVAL,
	MAX_HISTORY_SIZE,
	SPIN_COST,
} from '../constants/gameConstants';
import type { GameResult } from '../types/gameTypes';
import {
	calculateWinnings,
	checkJackpot,
	createGameResult,
	generateFinalReels,
	generateRandomReels,
	initReels,
} from '../utils/gameLogic';
import {
	loadGameState,
	saveCoins,
	saveGameHistory,
	saveLastCleanupCheck,
	saveTotalGames,
} from '../utils/storage';

export const useGameState = () => {
	// Load initial state from localStorage
	const initialState = loadGameState();

	// Game state
	const [gameMode, setGameMode] = useState<GameMode>('classic');
	const [reels, setReels] = useState<string[][]>([[]]); // Will be initialized in useEffect
	const [isSpinning, setIsSpinning] = useState(false);
	const [isJackpot, setIsJackpot] = useState(false);
	const [shake, setShake] = useState(false);
	const [spinCount, setSpinCount] = useState(0);
	const [lastJackpot, setLastJackpot] = useState<string | null>(null);
	const [showHistory, setShowHistory] = useState(false);

	// Game data from localStorage
	const [coins, setCoins] = useState(initialState.coins);
	const [gameHistory, setGameHistory] = useState<GameResult[]>(
		initialState.gameHistory
	);
	const [totalGamesPlayed, setTotalGamesPlayed] = useState(
		initialState.totalGamesPlayed
	);

	// Popup states
	const [showFreeCoinsPopup, setShowFreeCoinsPopup] = useState(false);
	const [showCleanupPopup, setShowCleanupPopup] = useState(false);
	const [showClearDataPopup, setShowClearDataPopup] = useState(false);
	const [freeCoinsAmount, setFreeCoinsAmount] = useState(0);

	// Initialize reels on game mode change
	useEffect(() => {
		setReels(initReels(gameMode));
	}, [gameMode]);

	// Save game history to localStorage
	useEffect(() => {
		saveGameHistory(gameHistory);
	}, [gameHistory]);

	// Save coins to localStorage
	useEffect(() => {
		saveCoins(coins);

		// Check if coins are zero to show free coins popup
		if (
			(coins === 0 || coins < SPIN_COST) &&
			!showFreeCoinsPopup &&
			!isSpinning
		) {
			const randomCoins = Math.floor(Math.random() * 110) + 30; // Random between 30 and 140
			setFreeCoinsAmount(randomCoins);
			setShowFreeCoinsPopup(true);
		}
	}, [coins, showFreeCoinsPopup, isSpinning]);

	// Save total games played to localStorage
	useEffect(() => {
		saveTotalGames(totalGamesPlayed);

		// Check if we should suggest cleanup (every 50 games)
		if (
			totalGamesPlayed > 0 &&
			totalGamesPlayed % CLEANUP_CHECK_INTERVAL === 0 &&
			gameHistory.length > MAX_HISTORY_SIZE
		) {
			setShowCleanupPopup(true);
			saveLastCleanupCheck(totalGamesPlayed);
		}
	}, [totalGamesPlayed, gameHistory.length]);

	// Trigger confetti for jackpot celebration
	const triggerJackpotCelebration = useCallback(() => {
		// Big burst of confetti
		confetti({
			particleCount: 150,
			spread: 100,
			origin: { y: 0.6 },
			colors: ['#FFD700', '#FFC0CB', '#00FFFF', '#FF4500', '#9400D3'],
		});

		// A few follow-up bursts for extra celebration
		setTimeout(() => {
			confetti({
				particleCount: 50,
				angle: 60,
				spread: 55,
				origin: { x: 0, y: 0.7 },
			});
		}, 500);

		setTimeout(() => {
			confetti({
				particleCount: 50,
				angle: 120,
				spread: 55,
				origin: { x: 1, y: 0.7 },
			});
		}, 900);
	}, []);

	// Function to close jackpot popup
	const closeJackpotPopup = useCallback(() => {
		setIsJackpot(false);
	}, []);

	// Function to claim free coins
	const claimFreeCoins = useCallback(() => {
		setCoins(prev => prev + freeCoinsAmount);
		setShowFreeCoinsPopup(false);
	}, [freeCoinsAmount]);

	// Function to clean up old game history
	const cleanupOldHistory = useCallback(() => {
		if (gameHistory.length > MAX_HISTORY_SIZE) {
			setGameHistory(prev => prev.slice(0, MAX_HISTORY_SIZE));
		}
		setShowCleanupPopup(false);
	}, [gameHistory.length]);

	// Function to clear all game data
	const clearAllGameData = useCallback(() => {
		setGameHistory([]);
		setCoins(initialState.coins);
		setIsJackpot(false);
		setShowFreeCoinsPopup(false);
		setLastJackpot(null);
		setShowClearDataPopup(false);
	}, [initialState.coins]);

	// Spin function
	const spin = useCallback(() => {
		// Don't allow spin if not enough coins
		if (coins < SPIN_COST) {
			setShake(true);
			setTimeout(() => setShake(false), 500);
			return;
		}

		setIsSpinning(true);
		setIsJackpot(false);
		setShake(false);
		setSpinCount(prev => prev + 1);
		setTotalGamesPlayed(prev => prev + 1);

		// Deduct spin cost from coins
		setCoins(prev => Math.max(0, prev - SPIN_COST));

		// Animation for spinning reels
		const interval = setInterval(() => {
			const randomReels = generateRandomReels(gameMode);
			setReels(randomReels);
		}, 100);

		// Stop spinning after 3-5 seconds (random for unpredictability)
		const spinTime = 3000 + Math.random() * 2000;
		setTimeout(() => {
			clearInterval(interval);

			// Generate final reel results
			const finalReels = generateFinalReels(gameMode);
			setReels(finalReels);
			setIsSpinning(false);

			// Check for jackpot
			const hasJackpot = checkJackpot(gameMode, finalReels);

			if (hasJackpot) {
				setIsJackpot(true);
				if (gameMode === 'classic' || gameMode === 'jackpot') {
					setLastJackpot(finalReels[0][0]);
				} else {
					setLastJackpot('🏆');
				}
				triggerJackpotCelebration();
			} else {
				setShake(true);
				setTimeout(() => setShake(false), 500);
			}

			// Calculate winnings and update coins
			const { coinsWon, multiplier } = calculateWinnings(
				gameMode,
				finalReels,
				hasJackpot
			);

			// Add result to history
			const newResult = createGameResult(
				gameMode,
				finalReels,
				hasJackpot,
				coinsWon,
				multiplier
			);

			setGameHistory(prev => [newResult, ...prev].slice(0, MAX_HISTORY_SIZE));

			// Update coins if won anything
			if (coinsWon > 0) {
				setCoins(prev => prev + coinsWon);
			}
		}, spinTime);
	}, [coins, gameMode, triggerJackpotCelebration]);

	return {
		// Game state
		gameMode,
		setGameMode,
		reels,
		isSpinning,
		isJackpot,
		shake,
		spinCount,
		lastJackpot,
		showHistory,
		setShowHistory,

		// Game data
		coins,
		gameHistory,
		totalGamesPlayed,

		// Popup states
		showFreeCoinsPopup,
		showCleanupPopup,
		setShowCleanupPopup,
		showClearDataPopup,
		setShowClearDataPopup,
		freeCoinsAmount,

		// Functions
		spin,
		closeJackpotPopup,
		claimFreeCoins,
		cleanupOldHistory,
		clearAllGameData,
	};
};

export default useGameState;
