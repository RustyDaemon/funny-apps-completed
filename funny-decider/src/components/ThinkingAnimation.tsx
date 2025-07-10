import { motion } from 'framer-motion';
import { FiPackage, FiRefreshCw, FiShoppingBag, FiZap } from 'react-icons/fi';

interface ThinkingAnimationProps {
	duration?: number;
}

const ThinkingAnimation = ({ duration = 5 }: ThinkingAnimationProps) => {
	const containerVariants = {
		initial: { opacity: 1 },
		animate: {
			opacity: 1,
			transition: {
				staggerChildren: 0.3,
				delayChildren: 0.2,
				repeat: Infinity,
				duration: duration,
			},
		},
	};

	const iconVariants = {
		initial: { scale: 0.8, opacity: 0.3 },
		animate: {
			scale: [0.8, 1.2, 0.8],
			opacity: [0.3, 1, 0.3],
			transition: {
				repeat: Infinity,
				duration: 2,
				ease: 'easeInOut' as const,
			},
		},
	};

	const icons = [FiShoppingBag, FiPackage, FiZap, FiRefreshCw];

	return (
		<motion.div
			className='flex items-center justify-center space-x-8 my-8'
			variants={containerVariants}
			initial='initial'
			animate='animate'
		>
			{icons.map((Icon, index) => (
				<motion.div key={index} variants={iconVariants}>
					<Icon size={36} className='text-[rgb(var(--primary))]' />
				</motion.div>
			))}
		</motion.div>
	);
};

export default ThinkingAnimation;
