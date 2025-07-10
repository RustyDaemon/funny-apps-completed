import { motion } from 'framer-motion';
import type { GameMode } from '../constants/gameConstants';
import { MULTIPLIERS } from '../constants/gameConstants';

type JackpotPopupProps = {
	isOpen: boolean;
	onClose: () => void;
	gameMode: GameMode;
	lastJackpot: string | null;
	spinCost: number;
};

const JackpotPopup: React.FC<JackpotPopupProps> = ({
	isOpen,
	onClose,
	gameMode,
	lastJackpot,
	spinCost,
}) => {
	if (!isOpen) return null;

	return (
		<motion.div
			initial={{ opacity: 0, y: -50, scale: 0.5 }}
			animate={{ opacity: 1, y: 0, scale: 1 }}
			exit={{ opacity: 0, y: 50, scale: 0.5 }}
			transition={{ type: 'spring', stiffness: 300, damping: 15 }}
			onClick={onClose}
			className='fixed top-1/4 left-0 right-0 mx-auto w-72 sm:w-80 md:w-96 bg-gradient-to-r 
                from-yellow-400 to-yellow-600 text-white p-4 sm:p-6 rounded-xl 
                text-center shadow-xl border-4 border-yellow-300 z-50 max-w-[90vw]
                cursor-pointer hover:brightness-105 transition-all'
		>
			<h2 className='text-4xl font-bold mb-2'>🎉 JACKPOT! 🎉</h2>
			<p className='text-xl mb-1'>
				You matched all {gameMode === 'jackpot' ? 'five' : 'of them'}!
			</p>
			{lastJackpot && (
				<div className='my-3 flex justify-center'>
					{[
						...Array(
							gameMode === 'jackpot' ? 5 : gameMode === 'classic' ? 3 : 3
						),
					].map((_, i) => (
						<span key={i} className='text-3xl'>
							{lastJackpot}
						</span>
					))}
				</div>
			)}
			<div className='mt-2 bg-yellow-300 text-yellow-800 py-2 px-4 rounded-full inline-block font-bold'>
				+{Math.floor(MULTIPLIERS.jackpot[gameMode] * spinCost)} coins
			</div>
			<p className='mt-2 text-yellow-100 text-sm opacity-80'>
				(Tap anywhere to close)
			</p>
		</motion.div>
	);
};

export default JackpotPopup;
