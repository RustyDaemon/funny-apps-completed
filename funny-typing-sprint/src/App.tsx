import { motion } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';
import { DifficultySelect } from './components/DifficultySelect';
import { MetricsDisplay } from './components/MetricsDisplay';
import { ResultsModal } from './components/ResultsModal';
import { SentenceDisplay } from './components/SentenceDisplay';
import { sentences, shuffleSentences } from './data/sentences';
import type { GameState, TimeDuration } from './types/game';
import {
	calculateMetrics,
	countWords,
	updateBackgroundOpacity,
} from './utils/gameUtils';

function App() {
	const [gameState, setGameState] = useState<GameState>({
		isActive: false,
		timeLeft: 30,
		duration: 30,
		currentSentenceIndex: 0,
		currentInput: '',
		sentences: shuffleSentences(sentences),
		startTime: null,
		totalTyped: 0,
		correctChars: 0,
		errors: 0,
		wordsTyped: 0,
	});

	const [showResults, setShowResults] = useState(false);
	const [selectedDuration, setSelectedDuration] = useState<TimeDuration>(30);
	const inputRef = useRef<HTMLInputElement>(null);
	const timerRef = useRef<number | null>(null);
	const metricsRef = useRef<number | null>(null);

	// Update background opacity based on errors
	useEffect(() => {
		const opacity = updateBackgroundOpacity(gameState.errors);
		document.documentElement.style.setProperty('opacity', opacity.toString());
	}, [gameState.errors]);

	const endGame = useCallback(() => {
		setGameState(prev => ({ ...prev, isActive: false }));
		document.documentElement.style.setProperty('opacity', '1.0');
		setShowResults(true);
	}, []);

	// Timer logic - Fixed to prevent early stopping
	useEffect(() => {
		if (gameState.isActive && gameState.timeLeft > 0) {
			timerRef.current = window.setTimeout(() => {
				setGameState(prev => {
					const newTimeLeft = prev.timeLeft - 1;
					if (newTimeLeft <= 0) {
						// End game when time reaches 0
						return { ...prev, timeLeft: 0, isActive: false };
					}
					return { ...prev, timeLeft: newTimeLeft };
				});
			}, 1000);
		}

		return () => {
			if (timerRef.current) {
				clearTimeout(timerRef.current);
				timerRef.current = null;
			}
		};
	}, [gameState.isActive, gameState.timeLeft]);

	// Handle game end when timer reaches 0
	useEffect(() => {
		if (
			!gameState.isActive &&
			gameState.timeLeft === 0 &&
			gameState.startTime
		) {
			// Clear all timers
			if (timerRef.current) {
				clearTimeout(timerRef.current);
				timerRef.current = null;
			}
			if (metricsRef.current) {
				clearInterval(metricsRef.current);
				metricsRef.current = null;
			}
			endGame();
		}
	}, [gameState.isActive, gameState.timeLeft, gameState.startTime, endGame]);

	// Metrics update logic - Reduced frequency for better performance
	useEffect(() => {
		if (gameState.isActive) {
			metricsRef.current = window.setInterval(() => {
				// Force a re-render to update metrics display
				setGameState(prev => ({ ...prev }));
			}, 500); // Reduced from 250ms to 500ms
		}

		return () => {
			if (metricsRef.current) {
				clearInterval(metricsRef.current);
				metricsRef.current = null;
			}
		};
	}, [gameState.isActive]);

	const startGame = useCallback(() => {
		// Clear any existing timers first
		if (timerRef.current) {
			clearTimeout(timerRef.current);
			timerRef.current = null;
		}
		if (metricsRef.current) {
			clearInterval(metricsRef.current);
			metricsRef.current = null;
		}

		const shuffledSentences = shuffleSentences(sentences);
		setGameState({
			isActive: true,
			timeLeft: selectedDuration,
			duration: selectedDuration,
			currentSentenceIndex: 0,
			currentInput: '',
			sentences: shuffledSentences,
			startTime: Date.now(),
			totalTyped: 0,
			correctChars: 0,
			errors: 0,
			wordsTyped: 0,
		});

		// Focus input after state update
		setTimeout(() => {
			inputRef.current?.focus();
		}, 100);

		// Reset background opacity
		document.documentElement.style.setProperty('--bg-opacity', '1');
	}, [selectedDuration]);

	const resetGame = useCallback(() => {
		// Clear all timers first
		if (timerRef.current) {
			clearTimeout(timerRef.current);
			timerRef.current = null;
		}
		if (metricsRef.current) {
			clearInterval(metricsRef.current);
			metricsRef.current = null;
		}

		setGameState({
			isActive: false,
			timeLeft: selectedDuration,
			duration: selectedDuration,
			currentSentenceIndex: 0,
			currentInput: '',
			sentences: shuffleSentences(sentences),
			startTime: null,
			totalTyped: 0,
			correctChars: 0,
			errors: 0,
			wordsTyped: 0,
		});
		setShowResults(false);

		// Reset background opacity
		document.documentElement.style.setProperty('--bg-opacity', '1');
	}, [selectedDuration]);

	const handleInputChange = useCallback(
		(event: React.ChangeEvent<HTMLInputElement>) => {
			if (!gameState.isActive) return;

			const newInput = event.target.value;
			// Calculate sentences needed: 1 sentence per 2 seconds, with a minimum of 8 sentences
			const sentencesNeeded = Math.max(Math.ceil(gameState.duration / 2), 8);
			const fullText = gameState.sentences.slice(0, sentencesNeeded).join(' ');

			// Prevent input longer than available text
			if (newInput.length > fullText.length) return;

			let newCorrectChars = 0;
			let newErrors = 0;
			const newTotalTyped = newInput.length;

			// Count correct characters and errors from the beginning
			for (let i = 0; i < newInput.length; i++) {
				if (newInput[i] === fullText[i]) {
					newCorrectChars++;
				} else {
					newErrors++;
				}
			}

			// Calculate words typed from the current input
			const currentWordsTyped = countWords(newInput);

			setGameState(prev => ({
				...prev,
				currentInput: newInput,
				totalTyped: newTotalTyped,
				correctChars: newCorrectChars,
				errors: newErrors,
				wordsTyped: currentWordsTyped,
			}));
		},
		[gameState.sentences, gameState.isActive, gameState.duration]
	);

	const handleKeyDown = useCallback(
		(event: React.KeyboardEvent<HTMLInputElement>) => {
			// Disable certain keys to maintain challenge integrity
			if (
				event.key === 'ArrowUp' ||
				event.key === 'ArrowDown' ||
				event.key === 'ArrowLeft' ||
				event.key === 'ArrowRight' ||
				event.key === 'Tab' ||
				event.key === 'Delete' ||
				event.key === 'Backspace' ||
				(event.ctrlKey && event.key === 'v') ||
				(event.metaKey && event.key === 'v')
			) {
				event.preventDefault();
			}
		},
		[]
	);

	const handleGlobalKeyDown = useCallback(
		(event: KeyboardEvent) => {
			// Space to start/replay when not typing
			if (
				event.code === 'Space' &&
				!gameState.isActive &&
				!showResults &&
				document.activeElement !== inputRef.current
			) {
				event.preventDefault();
				startGame();
			}
		},
		[gameState.isActive, showResults, startGame]
	);

	useEffect(() => {
		document.addEventListener('keydown', handleGlobalKeyDown);
		return () => document.removeEventListener('keydown', handleGlobalKeyDown);
	}, [handleGlobalKeyDown]);

	// Cleanup effect to ensure timers are cleared on unmount
	useEffect(() => {
		return () => {
			if (timerRef.current) {
				clearTimeout(timerRef.current);
			}
			if (metricsRef.current) {
				clearInterval(metricsRef.current);
			}
		};
	}, []);

	const currentMetrics = calculateMetrics(gameState);
	// Calculate sentences needed: 1 sentence per 2 seconds, with a minimum of 8 sentences
	const sentencesNeeded = Math.max(Math.ceil(gameState.duration / 2), 8);
	const displayText = gameState.sentences.slice(0, sentencesNeeded).join(' ');

	return (
		<div className='min-h-screen bg-black text-white flex flex-col'>
			<header className='text-center py-8'>
				<motion.h1
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					className='text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent no-select'
				>
					Funny Typing Sprint
				</motion.h1>
				<p className='text-gray-400 mt-2 no-select'>
					Test your typing speed and accuracy!
				</p>
			</header>

			<main className='flex-1 container mx-auto px-4 max-w-4xl'>
				{!gameState.isActive && !showResults && (
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						className='text-center space-y-8'
					>
						<DifficultySelect
							selectedDuration={selectedDuration}
							onDurationChange={setSelectedDuration}
							disabled={false}
						/>

						<motion.button
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							onClick={startGame}
							className='bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-12 py-4 rounded-xl text-xl font-bold shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-black'
						>
							🚀 START SPRINT
						</motion.button>

						<p className='text-gray-500 text-sm'>
							Press <kbd className='bg-gray-800 px-2 py-1 rounded'>Space</kbd>{' '}
							to start
						</p>
					</motion.div>
				)}

				{gameState.isActive && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						className='space-y-6'
					>
						<MetricsDisplay
							metrics={currentMetrics}
							timeLeft={gameState.timeLeft}
							duration={gameState.duration}
						/>

						<SentenceDisplay
							text={displayText}
							typedText={gameState.currentInput}
							isActive={gameState.isActive}
						/>

						<div className='max-w-2xl mx-auto'>
							<input
								ref={inputRef}
								type='text'
								value={gameState.currentInput}
								onChange={handleInputChange}
								onKeyDown={handleKeyDown}
								className='typing-input w-full bg-gray-800 text-white text-xl p-4 rounded-lg border-2 border-gray-700 focus:border-blue-500 transition-colors'
								placeholder='Start typing...'
								autoComplete='off'
								spellCheck={false}
							/>
						</div>
					</motion.div>
				)}
			</main>

			<ResultsModal
				isOpen={showResults}
				metrics={currentMetrics}
				onClose={resetGame}
			/>

			<footer className='text-center py-4 text-gray-500 text-sm no-select'></footer>
		</div>
	);
}

export default App;
