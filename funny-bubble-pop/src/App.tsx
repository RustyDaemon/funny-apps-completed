import { motion } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';
import { createConfetti, drawConfetti, updateConfetti } from './confetti';
import type { ConfettiParticle } from './types';

const GRID_MODES = {
	'3x3': { rows: 3, cols: 3 },
	'5x5': { rows: 5, cols: 5 },
	'9x9': { rows: 9, cols: 9 },
	'12x12': { rows: 12, cols: 12 },
	'15x15': { rows: 15, cols: 15 },
} as const;

type GridMode = keyof typeof GRID_MODES;

const createInitialGrid = (rows: number, cols: number): boolean[][] => {
	return Array.from({ length: rows }, () => Array(cols).fill(false));
};

function App() {
	const [currentMode, setCurrentMode] = useState<GridMode>('5x5');
	const { rows, cols } = GRID_MODES[currentMode];
	const totalBubbles = rows * cols;

	const [bubbles, setBubbles] = useState<boolean[][]>(() =>
		createInitialGrid(rows, cols)
	);
	const [confettiParticles, setConfettiParticles] = useState<
		ConfettiParticle[]
	>([]);
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const animationRef = useRef<number>(0);

	const poppedCount = bubbles.flat().filter(Boolean).length;
	const isComplete = poppedCount === totalBubbles;

	const popBubble = useCallback(
		(row: number, col: number) => {
			if (bubbles[row][col]) return; // Already popped

			setBubbles(prev => {
				const newBubbles = prev.map(r => [...r]);
				newBubbles[row][col] = true;
				return newBubbles;
			});

			// Create confetti at bubble position
			const bubbleElement = document.querySelector(
				`[data-bubble="${row}-${col}"]`
			) as HTMLElement;
			if (bubbleElement) {
				const rect = bubbleElement.getBoundingClientRect();
				const x = rect.left + rect.width / 2;
				const y = rect.top + rect.height / 2;

				setConfettiParticles(prev => [...prev, ...createConfetti(x, y)]);
			}
		},
		[bubbles]
	);

	const refillBubbles = useCallback(() => {
		setBubbles(createInitialGrid(rows, cols));
		setConfettiParticles([]);
	}, [rows, cols]);

	const changeMode = useCallback((mode: GridMode) => {
		setCurrentMode(mode);
		setBubbles(createInitialGrid(GRID_MODES[mode].rows, GRID_MODES[mode].cols));
		setConfettiParticles([]);
	}, []);

	// Animate confetti
	useEffect(() => {
		if (confettiParticles.length === 0) return;

		const animate = () => {
			setConfettiParticles(prev => {
				const updated = updateConfetti(prev);

				// Draw confetti
				const canvas = canvasRef.current;
				const ctx = canvas?.getContext('2d');
				if (canvas && ctx) {
					drawConfetti(ctx, updated);
				}

				return updated;
			});

			animationRef.current = requestAnimationFrame(animate);
		};

		animationRef.current = requestAnimationFrame(animate);

		return () => {
			if (animationRef.current) {
				cancelAnimationFrame(animationRef.current);
			}
		};
	}, [confettiParticles.length > 0]);

	// Update grid when mode changes
	useEffect(() => {
		setBubbles(createInitialGrid(rows, cols));
		setConfettiParticles([]);
	}, [currentMode, rows, cols]);
	// Update canvas size
	useEffect(() => {
		const canvas = canvasRef.current;
		if (canvas) {
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
		}
	}, []);

	return (
		<div className='min-h-screen bg-gradient-to-br from-pink-400 via-purple-500 to-indigo-600 flex items-center justify-center p-2 sm:p-4 md:p-8'>
			<canvas ref={canvasRef} className='confetti-canvas' />

			<motion.div
				className='w-full max-w-sm sm:max-w-2xl md:max-w-4xl bg-white/95 backdrop-blur-sm rounded-2xl md:rounded-3xl shadow-2xl p-4 sm:p-6 md:p-8 border-2 md:border-4 border-yellow-400'
				animate={
					isComplete
						? {
								rotate: [-1.5, 1.5, 0],
						  }
						: {}
				}
				transition={{ duration: 0.6, ease: 'easeInOut' }}
			>
				{/* Simple Project Title */}
				<h1 className='text-lg sm:text-xl md:text-2xl font-bold text-center text-gray-800 mb-3 sm:mb-4 md:mb-6'>
					Funny Bubble Pop
				</h1>
				{/* Mode Switcher */}
				<div className='flex flex-wrap justify-center gap-1 sm:gap-2 mb-3 sm:mb-4 md:mb-6'>
					{Object.keys(GRID_MODES).map(mode => (
						<motion.button
							key={mode}
							onClick={() => changeMode(mode as GridMode)}
							className={`
								px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-bold transition-all
								${
									currentMode === mode
										? 'bg-rainbow text-white shadow-lg'
										: 'bg-gray-200 text-gray-700 hover:bg-gray-300'
								}
							`}
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
						>
							{mode}
						</motion.button>
					))}
				</div>

				{/* Toolbar */}
				<div className='flex flex-col sm:flex-row justify-evenly items-center gap-2 sm:gap-0 mb-3 sm:mb-4 md:mb-6'>
					<div className='text-sm sm:text-base md:text-lg font-semibold text-purple-800'>
						Pops: {poppedCount} / {totalBubbles}
					</div>
					<motion.button
						onClick={refillBubbles}
						className='px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-green-400 to-blue-500 text-white font-bold rounded-lg shadow-lg hover:from-green-500 hover:to-blue-600 transition-all text-sm sm:text-base'
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
					>
						REFILL
					</motion.button>
				</div>

				{/* Enhanced Completion message */}
				{isComplete && (
					<motion.div
						className='text-center mb-3 sm:mb-4 md:mb-6 p-3 sm:p-4 bg-gradient-to-r from-green-100 to-blue-100 rounded-xl sm:rounded-2xl border-2 border-green-300'
						initial={{ opacity: 0, scale: 0.8 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ duration: 0.5 }}
					>
						<div className='text-lg sm:text-xl font-bold text-green-700 mb-1'>
							Fantastic!
						</div>
						<div className='text-base sm:text-lg text-gray-600'>
							All {totalBubbles} bubbles popped!
						</div>
					</motion.div>
				)}

				{/* Math-based Bubble Grid */}
				<div
					className='bubble-grid-math'
					style={{
						gridTemplateColumns: `repeat(${cols}, 1fr)`,
						gridTemplateRows: `repeat(${rows}, 1fr)`,
					}}
				>
					{bubbles.map((row, rowIndex) =>
						row.map((isPopped, colIndex) => (
							<motion.button
								key={`${currentMode}-${rowIndex}-${colIndex}`}
								data-bubble={`${rowIndex}-${colIndex}`}
								onClick={() => popBubble(rowIndex, colIndex)}
								className={`
									bubble-math
									${
										isPopped
											? 'bg-gradient-to-br from-red-200 to-red-300 shadow-inner border-2 border-red-400'
											: 'bg-gradient-to-br from-yellow-200 via-pink-200 to-purple-200 shadow-lg hover:from-yellow-300 hover:via-pink-300 hover:to-purple-300 active:scale-95 border-2 border-white'
									}
								`}
								initial={{ scale: 1, opacity: 1 }}
								animate={
									isPopped
										? {
												scale: [1, 1.3, 0.8],
												opacity: [1, 0.8, 0.6],
										  }
										: { scale: 1, opacity: 1 }
								}
								transition={{ duration: 0.3, ease: 'easeOut' }}
								disabled={isPopped}
							/>
						))
					)}
				</div>
			</motion.div>
		</div>
	);
}

export default App;
