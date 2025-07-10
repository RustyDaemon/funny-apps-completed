import { motion } from 'framer-motion';
import React, { useRef } from 'react';
import { ANIMATION_CONFIG, THEME_STYLES } from '../constants';
import { useLanguage } from '../hooks/useLanguage';
import { useSpinnerState } from '../hooks/useSpinnerState';
import { useTheme } from '../hooks/useTheme';
import type { GameData, SpinnerItem } from '../types';
import { Spinner, type SpinnerRef } from './Spinner';
import { BackButton, SpinButton } from './ui/Buttons';
import { LanguageSelector } from './ui/LanguageSelector';
import { ThemeToggle } from './ui/ThemeToggle';

interface GameProps {
	gameData: GameData;
	onRestart: () => void;
}

/**
 * Game component - manages the main game flow and UI
 */
export const Game: React.FC<GameProps> = ({ gameData, onRestart }) => {
	const spinnerRef = useRef<SpinnerRef>(null);
	const { isSpinning, result, setSpinning, setResult, reset } =
		useSpinnerState();
	const { theme } = useTheme();
	const { t } = useLanguage();

	/**
	 * Handles spin result from the Spinner component
	 */
	const handleSpinResult = (spinResult: SpinnerItem) => {
		setResult(spinResult);
	};

	/**
	 * Handles spin button click - either resets or starts spinning
	 */
	const handleSpin = () => {
		if (!spinnerRef.current) return;

		// If there's a result showing, this is "SPIN AGAIN" - just reset to initial state
		if (result) {
			spinnerRef.current.reset();
			reset();
		} else {
			// This is a normal "SPIN" - start spinning
			setSpinning(true);
			spinnerRef.current.spin();
		}
	};

	return (
		<div
			className={`h-screen ${THEME_STYLES.backgrounds[theme]} flex flex-col overflow-hidden transition-colors duration-300`}
		>
			{/* Header - Compact for mobile */}
			<motion.div
				className='flex-shrink-0 text-center py-2 md:py-4 px-4 relative'
				initial={{ y: -50, opacity: 0 }}
				animate={{ y: 0, opacity: 1 }}
				transition={ANIMATION_CONFIG.spring}
			>
				{/* Theme toggle and Language selector - positioned in top right */}
				<div className='absolute top-2 right-4 md:top-4 md:right-6 flex gap-2'>
					<ThemeToggle />
				</div>

				<div className='absolute top-2 left-4 md:top-4 md:left-6 flex gap-2'>
					<LanguageSelector />
				</div>

				<h1
					className={`text-xl md:text-3xl font-bold ${THEME_STYLES.text.primary[theme]} mb-2 md:mb-3`}
				>
					🎯 Funny Spinner 🎯
				</h1>
				<motion.div
					className={`${THEME_STYLES.cards[theme]} rounded-lg shadow-lg p-2 md:p-3 max-w-sm md:max-w-xl mx-auto transition-colors duration-300`}
					whileHover={{ scale: 1.02 }}
					transition={ANIMATION_CONFIG.smooth}
				>
					<h2
						className={`text-sm md:text-lg font-semibold ${THEME_STYLES.text.primary[theme]} leading-tight`}
					>
						{gameData.question}
					</h2>
				</motion.div>
			</motion.div>

			{/* Spinner Container - Responsive sizing with proper padding */}
			<motion.div
				className='flex-1 flex items-center justify-center p-3 md:p-4 min-h-0'
				initial={{ scale: 0.8, opacity: 0 }}
				animate={{ scale: 1, opacity: 1 }}
				transition={{ ...ANIMATION_CONFIG.spring, delay: 0.2 }}
			>
				<div className='w-full h-full max-w-xs max-h-72 sm:max-w-sm sm:max-h-80 md:max-w-lg md:max-h-96 lg:max-w-xl lg:max-h-[500px]'>
					<Spinner
						ref={spinnerRef}
						items={gameData.items}
						onSpin={handleSpinResult}
					/>
				</div>
			</motion.div>

			{/* Bottom Controls - Always at bottom */}
			<motion.div
				className={`flex-shrink-0 ${
					theme === 'dark' ? 'bg-gray-800/50' : 'bg-white/50'
				} backdrop-blur-sm ${
					theme === 'dark' ? 'border-gray-700/20' : 'border-white/20'
				} border-t p-4 transition-colors duration-300`}
				initial={{ y: 50, opacity: 0 }}
				animate={{ y: 0, opacity: 1 }}
				transition={{ ...ANIMATION_CONFIG.spring, delay: 0.4 }}
			>
				<div className='flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 max-w-md mx-auto'>
					<SpinButton
						isSpinning={isSpinning}
						hasResult={!!result}
						onClick={handleSpin}
					/>

					<BackButton onClick={onRestart} text={t('game.restart')} />
				</div>
			</motion.div>
		</div>
	);
};
