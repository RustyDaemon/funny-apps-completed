import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';
import { getHslString, hslToHex, isLightColor } from './utils/colorUtils';
import { getMoodLabel } from './utils/moodUtils';

function App() {
	// Color state
	const [hue, setHue] = useState(Math.floor(Math.random() * 360));
	const [saturation] = useState(100);
	const [lightness] = useState(50);
	// Notification state
	const [notification, setNotification] = useState({
		visible: false,
		message: '',
	});
	// Reference for timeout cleanup
	const notificationTimeoutRef = useRef<number | null>(null);

	// Derived values
	const hexColor = hslToHex(hue, saturation, lightness);
	const moodLabel = getMoodLabel(hue);
	const hslString = getHslString(hue, saturation, lightness);

	// Calculate if the color is bright (for text contrast)
	const isDarkText = isLightColor(hue, saturation, lightness);

	// Copy color to clipboard
	const copyToClipboard = useCallback(() => {
		navigator.clipboard.writeText(hexColor);

		// Clear any existing timeout
		if (notificationTimeoutRef.current) {
			window.clearTimeout(notificationTimeoutRef.current);
		}

		// Show notification
		setNotification({
			visible: true,
			message: 'Color code copied to clipboard!',
		});

		// Hide notification after 2 seconds
		notificationTimeoutRef.current = window.setTimeout(() => {
			setNotification({ visible: false, message: '' });
		}, 2000);
	}, [hexColor]);

	// Random color handler
	const handleRandomColor = useCallback(() => {
		setHue(Math.floor(Math.random() * 360));
	}, []);

	// Next color handler with useCallback to avoid recreating on every render
	const handleNextColor = useCallback(() => {
		// Random step between 10 and 45 degrees
		const step = 10 + Math.floor(Math.random() * 36);
		setHue(prevHue => (prevHue + step) % 360);
	}, []);

	// Keyboard event handlers
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.code === 'Space') {
				e.preventDefault();
				handleNextColor();
			} else if (e.code === 'KeyR') {
				e.preventDefault();
				handleRandomColor();
			}
		};

		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, [handleNextColor, handleRandomColor]);

	// Cleanup notification timeout on unmount
	useEffect(() => {
		return () => {
			if (notificationTimeoutRef.current) {
				window.clearTimeout(notificationTimeoutRef.current);
			}
		};
	}, []);

	return (
		<motion.main
			className='min-h-screen w-full flex flex-col items-center justify-center p-6'
			initial={{ backgroundColor: hslString }}
			animate={{ backgroundColor: hslString }}
			transition={{ duration: 1, ease: 'easeInOut' }}
		>
			{/* Notification Toast */}
			<AnimatePresence>
				{notification.visible && (
					<motion.div
						className='fixed top-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-lg z-50'
						initial={{ opacity: 0, y: -20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -20 }}
						transition={{ duration: 0.3 }}
					>
						{notification.message}
					</motion.div>
				)}
			</AnimatePresence>

			<div className='max-w-md w-full'>
				<AnimatePresence mode='wait'>
					<motion.div
						key={hue}
						className='bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-xl flex flex-col items-center'
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -20 }}
						transition={{ duration: 0.5 }}
					>
						<motion.h1
							className={`text-4xl font-bold mb-2 text-shadow ${
								isDarkText ? 'text-gray-800' : 'text-white'
							}`}
							initial={{ scale: 0.8 }}
							animate={{ scale: 1 }}
							transition={{ duration: 0.5 }}
						>
							{moodLabel}
						</motion.h1>

						<motion.button
							onClick={copyToClipboard}
							className={`text-2xl mb-8 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-full font-mono cursor-pointer transition-all
                            ${
															isDarkText
																? 'text-gray-800 hover:bg-white/40'
																: 'text-white hover:bg-white/30'
														}`}
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 0.2 }}
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							title='Click to copy to clipboard'
						>
							{hexColor}
						</motion.button>

						<div className='flex flex-wrap gap-3 justify-center'>
							<motion.button
								className={`bg-white/20 hover:bg-white/30 font-bold py-3 px-6 rounded-full 
                            focus:outline-none focus:ring-4 focus:ring-white/50 text-lg uppercase tracking-wider
                            transition-all duration-300 ease-in-out
                            ${isDarkText ? 'text-gray-800' : 'text-white'}`}
								onClick={handleNextColor}
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								animate={{
									scale: [1, 1.03, 1],
									transition: {
										repeat: Infinity,
										repeatType: 'reverse',
										duration: 2,
									},
								}}
							>
								Next Color
							</motion.button>

							<motion.button
								className={`bg-white/20 hover:bg-white/30 font-bold py-3 px-6 rounded-full 
                            focus:outline-none focus:ring-4 focus:ring-white/50 text-lg uppercase tracking-wider
                            transition-all duration-300 ease-in-out
                            ${isDarkText ? 'text-gray-800' : 'text-white'}`}
								onClick={handleRandomColor}
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
							>
								Random
							</motion.button>
						</div>
					</motion.div>
				</AnimatePresence>
			</div>

			<motion.div
				className={`text-sm mt-8 ${
					isDarkText ? 'text-gray-700' : 'text-white/70'
				}`}
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ delay: 1 }}
			>
				<p className='mb-1'>
					Press{' '}
					<kbd
						className={`${
							isDarkText ? 'bg-gray-800 text-white' : 'bg-white/20 text-white'
						} px-2 py-1 rounded text-xs`}
					>
						Space
					</kbd>{' '}
					for next color or{' '}
					<kbd
						className={`${
							isDarkText ? 'bg-gray-800 text-white' : 'bg-white/20 text-white'
						} px-2 py-1 rounded text-xs`}
					>
						R
					</kbd>{' '}
					for random
				</p>
				<p>Click the hex code to copy to clipboard</p>
			</motion.div>
		</motion.main>
	);
}

export default App;
