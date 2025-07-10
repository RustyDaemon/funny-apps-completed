import { motion } from 'framer-motion';
import React from 'react';
import { ANIMATION_CONFIG } from '../../constants';
import { useLanguage } from '../../hooks/useLanguage';
import { useTheme } from '../../hooks/useTheme';

interface SpinButtonProps {
	isSpinning: boolean;
	hasResult: boolean;
	onClick: () => void;
	disabled?: boolean;
}

/**
 * Reusable spin button component with different states and enhanced animations
 */
export const SpinButton: React.FC<SpinButtonProps> = ({
	isSpinning,
	hasResult,
	onClick,
	disabled = false,
}) => {
	const { theme } = useTheme();
	const { t } = useLanguage();

	const getButtonContent = () => {
		if (isSpinning) {
			return (
				<span className='flex items-center justify-center space-x-2'>
					<motion.div
						className='w-4 h-4 border-2 border-white border-t-transparent rounded-full'
						animate={{ rotate: 360 }}
						transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
					/>
					<span className='text-white'>{t('game.spinning')}</span>
				</span>
			);
		}
		return hasResult ? t('game.winner.spinAgain') : t('game.spin');
	};

	const getButtonStyles = () => {
		if (isSpinning || disabled) {
			return `bg-gray-400 text-gray-600 cursor-not-allowed ${
				theme === 'dark' ? 'bg-gray-600' : ''
			}`;
		}
		if (hasResult) {
			return 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700';
		}
		return 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700';
	};

	return (
		<motion.button
			onClick={onClick}
			disabled={isSpinning || disabled}
			className={`w-full sm:w-auto px-8 py-3 rounded-full font-bold text-base shadow-lg ${getButtonStyles()} transition-colors duration-200`}
			whileHover={!isSpinning && !disabled ? { scale: 1.05 } : {}}
			whileTap={!isSpinning && !disabled ? { scale: 0.95 } : {}}
			transition={ANIMATION_CONFIG.smooth}
		>
			{getButtonContent()}
		</motion.button>
	);
};

interface BackButtonProps {
	onClick: () => void;
	text?: string;
}

/**
 * Reusable back/navigation button component with enhanced animations
 */
export const BackButton: React.FC<BackButtonProps> = ({
	onClick,
	text = '← Back',
}) => {
	const { theme } = useTheme();

	return (
		<motion.button
			onClick={onClick}
			className={`
        w-full sm:w-auto px-6 py-3 rounded-full font-medium border transition-colors duration-200
        ${
					theme === 'dark'
						? 'text-blue-400 border-blue-400 hover:bg-blue-400/10'
						: 'text-blue-600 border-blue-600 hover:bg-blue-50'
				}
      `}
			whileHover={{ scale: 1.02 }}
			whileTap={{ scale: 0.98 }}
			transition={ANIMATION_CONFIG.smooth}
		>
			{text}
		</motion.button>
	);
};
