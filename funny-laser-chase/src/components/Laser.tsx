import { motion } from 'framer-motion';
import React from 'react';
import type { Position } from '../types';

interface LaserProps {
	position: Position;
}

export const Laser: React.FC<LaserProps> = ({ position }) => {
	return (
		<motion.div
			className='absolute w-4 h-4 bg-red-500 rounded-full shadow-lg laser-glow'
			style={{
				left: position.x - 8,
				top: position.y - 8,
			}}
			animate={{
				scale: [1, 1.2, 1],
				opacity: [0.8, 1, 0.8],
			}}
			transition={{
				duration: 0.5,
				repeat: Infinity,
				ease: 'easeInOut',
			}}
		/>
	);
};
