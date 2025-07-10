import { motion } from 'framer-motion';

interface GameCircleProps {
	gameState: 'idle' | 'waiting' | 'ready' | 'scored';
	onClick: () => void;
}

const GameCircle = ({ gameState, onClick }: GameCircleProps) => {
	const getCircleColor = () => {
		switch (gameState) {
			case 'waiting':
				return 'bg-gray-700';
			case 'ready':
				return 'bg-lime-500';
			default:
				return 'bg-slate-600';
		}
	};

	const getButtonText = () => {
		switch (gameState) {
			case 'idle':
				return 'START';
			case 'waiting':
				return 'Wait...';
			case 'ready':
				return 'CLICK!';
			case 'scored':
				return 'AGAIN';
			default:
				return 'START';
		}
	};

	return (
		<motion.div
			className={`w-[min(60vw,220px)] h-[min(60vw,220px)] md:w-80 md:h-80 rounded-full cursor-pointer transition-colors duration-200 flex items-center justify-center ${getCircleColor()}`}
			onClick={onClick}
			animate={{
				scale: gameState === 'ready' ? [1, 1.05, 1] : 1,
			}}
			transition={{
				duration: 0.3,
				ease: 'easeInOut',
			}}
			whileTap={{ scale: 0.95 }}
		>
			<span className='text-lg md:text-2xl font-bold text-white'>
				{getButtonText()}
			</span>
		</motion.div>
	);
};

export default GameCircle;
