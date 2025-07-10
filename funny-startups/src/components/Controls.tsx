import { motion } from 'framer-motion';

interface ControlsProps {
	onRoll: () => void;
	onCopy: () => void;
	isRolling: boolean;
	fullName: string;
}

export default function Controls({
	onRoll,
	onCopy,
	isRolling,
	fullName,
}: ControlsProps) {
	return (
		<div className='flex flex-col sm:flex-row gap-4 justify-center items-center mt-8'>
			<motion.button
				onClick={onRoll}
				disabled={isRolling}
				whileHover={{ scale: isRolling ? 1 : 1.05 }}
				whileTap={{ scale: isRolling ? 1 : 0.95 }}
				className={`
          px-8 py-4 text-lg xl:text-xl font-bold rounded-2xl
          ${
						isRolling
							? 'bg-gray-600 text-gray-400 cursor-not-allowed'
							: 'bg-gradient-to-r from-pink-500 to-fuchsia-600 text-white hover:from-pink-600 hover:to-fuchsia-700 shadow-lg hover:shadow-xl'
					}
        `}
			>
				{isRolling ? (
					<span className='flex items-center gap-2'>
						<motion.div
							animate={{ rotate: 360 }}
							transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
							className='w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full'
						/>
						ROLLING...
					</span>
				) : (
					'ROLL NAME'
				)}
			</motion.button>

			<motion.button
				onClick={onCopy}
				disabled={isRolling}
				whileHover={{ scale: isRolling ? 1 : 1.05 }}
				whileTap={{ scale: isRolling ? 1 : 0.95 }}
				className={`
          px-8 py-4 text-lg xl:text-xl font-bold rounded-2xl border-2 transition-all duration-200
          ${
						isRolling
							? 'border-gray-600 text-gray-400 cursor-not-allowed'
							: 'border-pink-500 text-pink-500 hover:bg-pink-500 hover:text-white shadow-lg hover:shadow-xl'
					}
        `}
				title={`Copy "${fullName}" to clipboard`}
			>
				COPY
			</motion.button>
		</div>
	);
}
