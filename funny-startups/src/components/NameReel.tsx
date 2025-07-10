import { motion } from 'framer-motion';
import { adjectives, nouns } from '../data/words';

interface NameReelProps {
	targetWord: string;
	isAdjective?: boolean;
	isRolling: boolean;
}

export default function NameReel({
	targetWord,
	isAdjective = false,
	isRolling,
}: NameReelProps) {
	const words = isAdjective ? adjectives : nouns;

	// Create a cycling sequence of words for the rolling effect
	const createRollingSequence = () => {
		const shuffled = [...words].sort(() => Math.random() - 0.5);
		return shuffled.slice(0, 15); // Show 15 different words during roll
	};

	const rollingWords = createRollingSequence();

	return (
		<div className='relative h-16 overflow-hidden'>
			{isRolling ? (
				<motion.div
					initial={{ y: 0 }}
					animate={{ y: -240 }} // Move up through 15 words (16px each)
					transition={{
						duration: 0.9,
						ease: [0.25, 0.46, 0.45, 0.94], // Custom ease-out curve
					}}
					className='absolute inset-0'
				>
					{rollingWords.map((word, index) => (
						<motion.div
							key={`${word}-${index}`}
							className='h-16 flex items-center justify-center text-2xl xl:text-4xl font-bold text-white'
							style={{
								filter:
									index < rollingWords.length - 1 ? 'blur(2px)' : 'blur(0px)',
								opacity: index < rollingWords.length - 1 ? 0.7 : 1,
							}}
						>
							{word}
						</motion.div>
					))}
					{/* Final target word */}
					<div className='h-16 flex items-center justify-center text-2xl xl:text-4xl font-bold text-white'>
						{targetWord}
					</div>
				</motion.div>
			) : (
				<div className='h-16 flex items-center justify-center text-2xl xl:text-4xl font-bold text-white'>
					{targetWord}
				</div>
			)}
		</div>
	);
}
