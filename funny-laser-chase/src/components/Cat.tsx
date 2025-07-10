import { motion } from 'framer-motion';
import React, { useEffect } from 'react';
import type { Cat as CatType } from '../types';

interface CatProps {
	cat: CatType;
	onAnimationComplete?: () => void;
}

export const Cat: React.FC<CatProps> = ({ cat, onAnimationComplete }) => {
	const randomRotation = React.useMemo(() => Math.random() * 40 - 20, []); // -20 to 20 degrees

	useEffect(() => {
		// Set up a timer to handle cat lifecycle (5 seconds)
		const timer = setTimeout(() => {
			onAnimationComplete?.();
		}, 5000);

		return () => clearTimeout(timer);
	}, [onAnimationComplete]);

	return (
		<motion.div
			key={cat.id}
			className='absolute text-2xl select-none pointer-events-none z-10 will-change-transform'
			style={{
				backfaceVisibility: 'hidden',
				transform: 'translateZ(0)',
			}}
			initial={{
				x: cat.position.x - 16,
				y: cat.position.y - 16,
				scale: 0,
				rotate: 0,
			}}
			animate={{
				x: cat.targetPosition.x - 16,
				y: cat.targetPosition.y - 16,
				scale: 1,
				rotate: cat.isChasing
					? [
							randomRotation,
							randomRotation - 10,
							randomRotation + 10,
							randomRotation,
					  ]
					: randomRotation,
			}}
			exit={{
				scale: 0,
				opacity: 0,
				rotate: 360,
			}}
			transition={{
				scale: { duration: 0.3, ease: 'backOut' },
				x: { duration: 0.8, ease: 'easeOut' },
				y: { duration: 0.8, ease: 'easeOut' },
				rotate: cat.isChasing
					? { duration: 0.5, repeat: Infinity, ease: 'easeInOut' }
					: { duration: 0.3 },
				opacity: { duration: 0.3 },
			}}
		>
			🐱
		</motion.div>
	);
};
