import { motion } from 'framer-motion';
import { SPIN_COST } from '../constants/gameConstants';

type FreeCoinsPopupProps = {
	isOpen: boolean;
	coins: number;
	onClaim: () => void;
};

const FreeCoinsPopup: React.FC<FreeCoinsPopupProps> = ({
	isOpen,
	coins,
	onClaim,
}) => {
	if (!isOpen) return null;

	return (
		<motion.div
			initial={{ opacity: 0, y: -50, scale: 0.5 }}
			animate={{ opacity: 1, y: 0, scale: 1 }}
			exit={{ opacity: 0, y: 50, scale: 0.5 }}
			transition={{ type: 'spring', stiffness: 300, damping: 15 }}
			className='fixed top-1/3 left-0 right-0 mx-auto w-72 sm:w-80 md:w-96 
              bg-gradient-to-r from-blue-400 to-indigo-600 text-white p-4 sm:p-6 rounded-xl 
              text-center shadow-xl border-4 border-blue-300 z-50 max-w-[90vw]'
		>
			<h2 className='text-2xl sm:text-3xl font-bold mb-2'>Out of Coins!</h2>
			<p className='text-md sm:text-lg mb-4'>
				Here's a little help to keep the fun going!
			</p>
			<div className='my-3 bg-white/20 py-3 px-4 rounded-lg inline-block'>
				<span className='text-3xl sm:text-4xl font-bold text-yellow-200'>
					{coins}
				</span>
				<span className='text-xl sm:text-2xl ml-2'>Coins</span>
			</div>
			<p className='text-sm mt-1 opacity-80'>
				(Each spin costs {SPIN_COST} coins)
			</p>
			<button
				onClick={onClaim}
				className='mt-3 bg-yellow-400 hover:bg-yellow-300 text-yellow-800 
                   font-bold py-2 px-6 rounded-full transition-colors
                   shadow-md hover:shadow-lg w-full'
			>
				CLAIM COINS
			</button>
		</motion.div>
	);
};

export default FreeCoinsPopup;
