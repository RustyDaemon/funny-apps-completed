import { motion } from 'framer-motion';
import { EMOJIS_BY_MODE, type GameMode } from '../constants/gameConstants';

type ReelProps = {
	emoji: string;
	isSpinning: boolean;
	index: number;
	mode: GameMode;
};

const Reel: React.FC<ReelProps> = ({ emoji, isSpinning, index, mode }) => {
	// Create a sequence of emojis for the reel
	const currentEmojis = EMOJIS_BY_MODE[mode];
	const reelItems = [...currentEmojis, ...currentEmojis].sort(
		() => Math.random() - 0.5
	);

	// Adjust size based on game mode
	const sizeClass =
		mode === 'jackpot'
			? 'h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24' // Smaller for 5-reel jackpot
			: mode === 'grid3x3'
			? 'h-20 w-20 sm:h-24 sm:w-24 md:h-28 md:w-28' // Medium for 3x3 grid
			: 'h-24 w-24 sm:h-28 sm:w-28 md:h-32 md:w-32'; // Larger for classic and retro

	const emojiSizeClass =
		mode === 'jackpot'
			? 'text-4xl sm:text-5xl'
			: mode === 'grid3x3'
			? 'text-5xl sm:text-6xl'
			: 'text-6xl sm:text-7xl';

	return (
		<div
			className={`relative ${sizeClass} overflow-hidden
             bg-gradient-to-b from-indigo-50 to-blue-100 dark:from-slate-800 dark:to-slate-900 
             rounded-xl border-4 border-indigo-200 dark:border-slate-700
             flex items-center justify-center shadow-lg perspective-1000`}
		>
			<div className='reel-gradient absolute inset-0'></div>
			<motion.div
				animate={{
					y: isSpinning ? [0, -800] : 0,
				}}
				transition={{
					duration: isSpinning ? 0.8 + index * 0.2 : 0.5,
					ease: isSpinning ? 'linear' : [0.25, 0.1, 0.25, 1.0],
					repeat: isSpinning ? Infinity : 0,
					repeatType: 'loop',
				}}
				className='flex flex-col items-center'
			>
				{isSpinning ? (
					// Show a scrolling strip of emojis when spinning
					reelItems.map((item, i) => (
						<div
							key={i}
							className={`${sizeClass} flex items-center justify-center`}
						>
							<span className={`${emojiSizeClass} select-none`}>{item}</span>
						</div>
					))
				) : (
					// Show just the final emoji when not spinning
					<span className={`${emojiSizeClass} md:text-7xl select-none`}>
						{emoji}
					</span>
				)}
			</motion.div>
		</div>
	);
};

export default Reel;
