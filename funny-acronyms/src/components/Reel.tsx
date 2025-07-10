import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import type { ReelProps } from '../types';

const SPIN_DURATION = 1;
const WORDS_PER_CYCLE = 8;

export function Reel({
	letter,
	words,
	locked,
	onToggleLock,
	isSpinning,
	finalWord,
	onSpinComplete,
}: ReelProps) {
	const [currentWords, setCurrentWords] = useState<string[]>([]);
	const [isAnimating, setIsAnimating] = useState(false);

	useEffect(() => {
		if (isSpinning && !locked) {
			setIsAnimating(true);
			// Generate cycling words for animation
			const cycleWords = [];
			for (let i = 0; i < WORDS_PER_CYCLE; i++) {
				cycleWords.push(words[Math.floor(Math.random() * words.length)]);
			}
			cycleWords.push(finalWord); // End with the final word
			setCurrentWords(cycleWords);

			// Auto-complete after spin duration
			setTimeout(() => {
				setIsAnimating(false);
				onSpinComplete();
			}, SPIN_DURATION * 1000);
		} else if (!isSpinning) {
			setCurrentWords([finalWord]);
			setIsAnimating(false);
		}
	}, [isSpinning, locked, finalWord, words, onSpinComplete]);

	return (
		<div className='relative'>
			{/* Reel Container */}
			<div className='w-32 h-20 md:w-40 md:h-24 rounded-xl bg-gray-800/70 flex items-center justify-center text-2xl md:text-3xl font-semibold overflow-hidden relative'>
				{/* Lock Overlay */}
				{locked && (
					<div className='absolute inset-0 bg-gray-900/50 rounded-xl z-10' />
				)}

				{/* Spinning Words */}
				<AnimatePresence mode='wait'>
					{isAnimating && !locked ? (
						<motion.div
							key='spinning'
							className='absolute inset-0 flex flex-col justify-center'
							initial={{ y: 0 }}
							animate={{
								y: [0, -100 * WORDS_PER_CYCLE],
								transition: {
									duration: SPIN_DURATION,
									ease: 'linear',
									repeat: 0,
								},
							}}
						>
							{currentWords.map((word, index) => (
								<div
									key={`${word}-${index}`}
									className='h-20 md:h-24 flex items-center justify-center text-indigo-300'
								>
									{word}
								</div>
							))}
						</motion.div>
					) : (
						<motion.div
							key='static'
							className='text-indigo-300'
							initial={{ opacity: 0, scale: 0.8 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{
								type: 'spring',
								stiffness: 300,
								damping: 20,
								duration: 0.3,
							}}
						>
							{finalWord}
						</motion.div>
					)}
				</AnimatePresence>
			</div>

			{/* Lock Button */}
			<motion.button
				onClick={onToggleLock}
				className='absolute -top-2 -right-2 w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity z-20'
				whileHover={{ scale: 1.1 }}
				whileTap={{ scale: 0.95 }}
				animate={{
					rotateY: locked ? 180 : 0,
					transition: { duration: 0.3 },
				}}
			>
				<span className='text-sm'>{locked ? '🔒' : '🔓'}</span>
			</motion.button>

			{/* Letter Label */}
			{letter && (
				<div className='absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-indigo-400 font-bold text-lg'>
					{letter}
				</div>
			)}
		</div>
	);
}
