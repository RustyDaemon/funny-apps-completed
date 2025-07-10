import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';
import { JOKES } from './data';
import './index.css';

const SCRATCH_RADIUS = 26;
const REVEAL_THRESHOLD = 0.64;

function getRandomJoke() {
	return JOKES[Math.floor(Math.random() * JOKES.length)];
}

function App() {
	const [joke, setJoke] = useState(getRandomJoke());
	const [isRevealed, setIsRevealed] = useState(false);
	const [isScratching, setIsScratching] = useState(false);
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const lastPosRef = useRef<{ x: number; y: number } | null>(null);

	// Calculate optimal size to fill most of the screen
	const getOptimalSize = () => {
		const size = Math.min(window.innerWidth, window.innerHeight) * 0.65;
		return Math.max(400, Math.min(size, 800));
	};

	const [gameSize, setGameSize] = useState(getOptimalSize);

	useEffect(() => {
		const handleResize = () => setGameSize(getOptimalSize());
		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	// Initialize canvas with scratch layer
	const initializeCanvas = useCallback(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		// Create scratch-off layer
		ctx.fillStyle = '#8B8B8B';
		ctx.fillRect(0, 0, canvas.width, canvas.height);
	}, []);

	// Initialize on mount and reset
	useEffect(() => {
		if (!isRevealed) {
			initializeCanvas();
		}
	}, [initializeCanvas, isRevealed, joke]);

	// Check if enough area is scratched
	const checkScratchProgress = useCallback(() => {
		const canvas = canvasRef.current;
		if (!canvas || isRevealed) return;

		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
		let transparentPixels = 0;

		// Sample every 4th pixel for performance
		for (let i = 3; i < imageData.data.length; i += 16) {
			if (imageData.data[i] === 0) transparentPixels++;
		}

		const totalSamples = Math.floor(imageData.data.length / 16);
		const scratchedPercent = transparentPixels / totalSamples;

		if (scratchedPercent >= REVEAL_THRESHOLD) {
			setIsRevealed(true);
		}
	}, [isRevealed]);

	// Smooth scratching function
	const performScratch = useCallback(
		(x: number, y: number) => {
			const canvas = canvasRef.current;
			if (!canvas || isRevealed) return;

			const ctx = canvas.getContext('2d');
			if (!ctx) return;

			ctx.globalCompositeOperation = 'destination-out';
			ctx.lineWidth = SCRATCH_RADIUS * 2;
			ctx.lineCap = 'round';
			ctx.lineJoin = 'round';

			if (lastPosRef.current && isScratching) {
				// Draw smooth line from last position
				ctx.beginPath();
				ctx.moveTo(lastPosRef.current.x, lastPosRef.current.y);
				ctx.lineTo(x, y);
				ctx.stroke();
			} else {
				// Initial touch - draw circle
				ctx.beginPath();
				ctx.arc(x, y, SCRATCH_RADIUS, 0, 2 * Math.PI);
				ctx.fill();
			}

			lastPosRef.current = { x, y };
			ctx.globalCompositeOperation = 'source-over';

			// Check progress periodically for performance
			if (Math.random() < 0.1) {
				checkScratchProgress();
			}
		},
		[isRevealed, isScratching, checkScratchProgress]
	);

	// Pointer event handlers
	const handlePointerDown = useCallback(
		(e: React.PointerEvent) => {
			if (isRevealed) return;

			setIsScratching(true);
			const rect = e.currentTarget.getBoundingClientRect();
			const x = (e.clientX - rect.left + 4) * (gameSize / rect.width);
			const y = (e.clientY - rect.top + 4) * (gameSize / rect.height);
			performScratch(x, y);
		},
		[isRevealed, gameSize, performScratch]
	);

	const handlePointerMove = useCallback(
		(e: React.PointerEvent) => {
			if (!isScratching || isRevealed) return;

			const rect = e.currentTarget.getBoundingClientRect();
			const x = (e.clientX - rect.left) * (gameSize / rect.width);
			const y = (e.clientY - rect.top) * (gameSize / rect.height);
			performScratch(x, y);
		},
		[isScratching, isRevealed, gameSize, performScratch]
	);

	const handlePointerUp = useCallback(() => {
		setIsScratching(false);
		lastPosRef.current = null;
	}, []);

	// Reset game
	const resetGame = useCallback(() => {
		setJoke(getRandomJoke());
		setIsRevealed(false);
		setIsScratching(false);
		lastPosRef.current = null;
	}, []);

	return (
		<div className='min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex flex-col items-center justify-center p-4 relative overflow-hidden'>
			{/* Header */}
			<motion.header
				initial={{ opacity: 0, y: -30 }}
				animate={{ opacity: 1, y: 0 }}
				className='text-center mb-4 z-10'
			>
				<h1 className='text-3xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-orange-400 to-red-400 mb-2'>
					Funny Scratch Game
				</h1>
			</motion.header>

			{/* Main game area */}
			<motion.main
				className='relative'
				style={{ width: gameSize, height: gameSize }}
				initial={{ scale: 0.9, opacity: 0 }}
				animate={{ scale: 1, opacity: 1 }}
				transition={{ duration: 0.5 }}
			>
				{/* Inner card */}
				<div className='absolute inset-2 bg-gradient-to-br from-yellow-100 to-amber-100 rounded-2xl shadow-inner overflow-hidden'>
					{/* Revealed content */}
					<AnimatePresence>
						{isRevealed && (
							<motion.div
								className='absolute inset-0 flex flex-col items-center justify-center p-8'
								initial={{ opacity: 0, scale: 0.8 }}
								animate={{ opacity: 1, scale: 1 }}
								transition={{ duration: 0.6, type: 'spring', stiffness: 100 }}
							>
								<div className='text-center'>
									<motion.div
										className='text-6xl sm:text-8xl mb-6'
										animate={{ rotate: [0, 5, -5, 0] }}
										transition={{
											duration: 2,
											repeat: Infinity,
											ease: 'easeInOut',
										}}
									>
										{joke.emoji}
									</motion.div>
									<motion.p
										className='text-xl sm:text-2xl font-bold text-gray-800 leading-relaxed max-w-lg'
										initial={{ opacity: 0, y: 20 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ delay: 0.3, duration: 0.5 }}
									>
										{joke.quip}
									</motion.p>
								</div>
							</motion.div>
						)}
					</AnimatePresence>

					{/* Scratch canvas */}
					<canvas
						ref={canvasRef}
						width={gameSize - 32}
						height={gameSize - 32}
						className={`absolute inset-2 rounded-2xl scratch-eraser transition-opacity duration-300 ${
							isRevealed ? 'opacity-0 pointer-events-none' : 'opacity-100'
						}`}
						onPointerDown={handlePointerDown}
						onPointerMove={handlePointerMove}
						onPointerUp={handlePointerUp}
						onPointerLeave={handlePointerUp}
						tabIndex={0}
						aria-label='Scratch to reveal the joke'
					/>
				</div>
			</motion.main>

			{/* Controls */}
			<motion.div
				className='flex gap-4 mt-6 z-10'
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.3 }}
			>
				<motion.button
					onClick={resetGame}
					className='px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-full shadow-lg hover:shadow-xl border-2 border-white/20'
					whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.95 }}
				>
					🎮 {isRevealed ? 'Play Again' : 'New Game'}
				</motion.button>
			</motion.div>

			{/* Instructions */}
			{!isRevealed && (
				<motion.p
					className='text-white/60 text-center mt-4 text-sm'
					animate={{ opacity: [0.6, 1, 0.6] }}
					transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
				>
					✨ Drag to scratch ✨
				</motion.p>
			)}
		</div>
	);
}

export default App;
