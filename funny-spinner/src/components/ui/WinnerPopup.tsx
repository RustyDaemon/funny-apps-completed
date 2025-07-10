import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';
import { ANIMATION_CONFIG } from '../../constants';
import { useLanguage } from '../../hooks/useLanguage';
import { useTheme } from '../../hooks/useTheme';
import type { SpinnerItem } from '../../types';

interface WinnerPopupProps {
	winner: SpinnerItem;
	isVisible: boolean;
}

/**
 * Winner popup overlay component with enhanced animations
 */
export const WinnerPopup: React.FC<WinnerPopupProps> = ({
	winner,
	isVisible,
}) => {
	const { theme } = useTheme();
	const { t } = useLanguage();

	return (
		<AnimatePresence>
			{isVisible && (
				<motion.div
					className='absolute inset-0 flex items-center justify-center pointer-events-none'
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={ANIMATION_CONFIG.smooth}
				>
					<motion.div
						className={`
              ${
								theme === 'dark'
									? 'bg-gray-800 border-green-400'
									: 'bg-white border-green-400'
							} 
              border-2 rounded-xl p-3 md:p-4 shadow-2xl pointer-events-auto max-w-xs mx-4 transition-colors duration-300
            `}
						initial={{ scale: 0, rotate: -180 }}
						animate={{ scale: 1, rotate: 0 }}
						exit={{ scale: 0, rotate: 180 }}
						transition={{
							...ANIMATION_CONFIG.bounce,
							delay: 0.2,
						}}
					>
						<motion.h3
							className={`text-base md:text-lg font-bold ${
								theme === 'dark' ? 'text-green-400' : 'text-green-800'
							} mb-1 text-center`}
							initial={{ y: 20, opacity: 0 }}
							animate={{ y: 0, opacity: 1 }}
							transition={{ delay: 0.5 }}
						>
							{t('game.winner.title')}
						</motion.h3>
						<motion.p
							className={`text-lg md:text-xl font-bold ${
								theme === 'dark' ? 'text-green-300' : 'text-green-900'
							} break-words text-center`}
							initial={{ y: 20, opacity: 0 }}
							animate={{ y: 0, opacity: 1 }}
							transition={{ delay: 0.7 }}
						>
							{winner.text}
						</motion.p>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	);
};
