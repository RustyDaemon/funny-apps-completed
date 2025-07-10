import { useEffect, useRef, useState } from 'react';

import ConfettiCanvas from './components/ConfettiCanvas';
import GameCircle from './components/GameCircle';
import GameNotification from './components/GameNotification';
import ResetButton from './components/ResetButton';
import ScoreStats from './components/ScoreStats';
import { type GameState, STORAGE_KEYS, getVerdict } from './utils/gameUtils';

function App() {
	const [gameState, setGameState] = useState<GameState>('idle');
	const [reactionTime, setReactionTime] = useState<number | null>(null);
	const [bestTime, setBestTime] = useState<number | null>(null);
	const [worstTime, setWorstTime] = useState<number | null>(null);
	const [showToast, setShowToast] = useState<string | null>(null);
	const [toastType, setToastType] = useState<'error' | 'success' | 'info'>(
		'info'
	);
	const [showConfetti, setShowConfetti] = useState(false);
	const [isNewBest, setIsNewBest] = useState(false);

	const timeoutRef = useRef<number | null>(null);
	const startTimeRef = useRef<number | null>(null);

	// Load saved scores from localStorage
	useEffect(() => {
		const savedBest = localStorage.getItem(STORAGE_KEYS.best);
		const savedWorst = localStorage.getItem(STORAGE_KEYS.worst);

		if (savedBest) setBestTime(parseInt(savedBest, 10));
		if (savedWorst) setWorstTime(parseInt(savedWorst, 10));
	}, []);

	// Toast auto-dismiss
	useEffect(() => {
		if (showToast) {
			const timer = setTimeout(() => setShowToast(null), 1200);
			return () => clearTimeout(timer);
		}
	}, [showToast]);

	const startGame = () => {
		setGameState('waiting');
		setReactionTime(null);
		setIsNewBest(false);

		// Random delay between 1-5 seconds
		const delay = Math.random() * 4000 + 1000;

		timeoutRef.current = window.setTimeout(() => {
			setGameState('ready');
			startTimeRef.current = performance.now();
		}, delay);
	};

	const handleCircleClick = () => {
		if (gameState === 'waiting') {
			// False start
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
				timeoutRef.current = null;
			}
			setGameState('idle');
			setToastType('error');
			setShowToast('Too soon!');
			return;
		}

		if (gameState === 'ready') {
			const endTime = performance.now();
			const reaction = Math.round(endTime - (startTimeRef.current || 0));
			setReactionTime(reaction);
			setGameState('scored');

			// Update best/worst scores
			if (bestTime === null || reaction < bestTime) {
				setBestTime(reaction);
				localStorage.setItem(STORAGE_KEYS.best, reaction.toString());
				setIsNewBest(true);
				setShowConfetti(true);
			}

			if (worstTime === null || reaction > worstTime) {
				setWorstTime(reaction);
				localStorage.setItem(STORAGE_KEYS.worst, reaction.toString());
			}

			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
				timeoutRef.current = null;
			}
		}

		if (gameState === 'scored' || gameState === 'idle') {
			startGame();
		}
	};

	const resetScores = () => {
		localStorage.removeItem(STORAGE_KEYS.best);
		localStorage.removeItem(STORAGE_KEYS.worst);
		setBestTime(null);
		setWorstTime(null);
		resetGame();
	};

	const resetGame = () => {
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
			timeoutRef.current = null;
		}
		setGameState('idle');
		setReactionTime(null);
		setIsNewBest(false);
	};

	// Cleanup timeout on unmount
	useEffect(() => {
		return () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
		};
	}, []);

	const verdict = reactionTime ? getVerdict(reactionTime) : null;

	return (
		<div className='min-h-screen bg-slate-900 flex items-center justify-center p-4'>
			<ConfettiCanvas
				showConfetti={showConfetti}
				onConfettiEnd={() => setShowConfetti(false)}
			/>

			{/* Main Game Card */}
			<div className='max-w-lg w-[90vw] rounded-3xl shadow-2xl p-10 flex flex-col items-center bg-slate-800 text-white'>
				{/* Title */}
				<h1 className='text-3xl font-bold text-center mb-8 text-slate-100'>
					Funny Reaction Tester
				</h1>

				{/* Game Circle */}
				<GameCircle gameState={gameState} onClick={handleCircleClick} />

				{/* Results or Notification */}
				<GameNotification
					showToast={showToast}
					toastType={toastType}
					reactionTime={reactionTime}
					verdict={verdict}
				/>

				{/* Score Statistics */}
				<ScoreStats
					bestTime={bestTime}
					worstTime={worstTime}
					isNewBest={isNewBest}
				/>

				{/* Reset Button */}
				<ResetButton
					bestTime={bestTime}
					worstTime={worstTime}
					onReset={resetScores}
				/>
			</div>
		</div>
	);
}

export default App;
