import { motion } from 'framer-motion';
import React from 'react';

interface ScoreboardProps {
	catches: number;
	onReset: () => void;
}

export const Scoreboard: React.FC<ScoreboardProps> = ({ catches, onReset }) => {
	return (
		<div className='absolute top-4 left-4 right-4 flex justify-between items-center z-20'>
			<motion.div
				className='bg-black/50 backdrop-blur-sm rounded-lg px-4 py-2 text-white font-bold'
				key={catches}
				animate={{ scale: [1, 1.2, 1] }}
				transition={{ duration: 0.3 }}
			>
				<span className='text-cyan-400'>Catches: </span>
				<span className='text-xl'>{catches}</span>
			</motion.div>

			<div className='flex gap-2'>
				<button
					onClick={onReset}
					className='bg-red-600/80 backdrop-blur-sm rounded-lg px-4 py-2 text-white font-semibold hover:bg-red-600 transition-colors'
				>
					RESET
				</button>
			</div>
		</div>
	);
};
