import { motion } from 'framer-motion';
import { useCallback, useState } from 'react';
import Controls from './components/Controls';
import EmojiLogo from './components/EmojiLogo';
import NameReel from './components/NameReel';
import Toast from './components/Toast';
import { getRandomName } from './data/words';

function App() {
	const [currentName, setCurrentName] = useState(() => getRandomName());
	const [isRolling, setIsRolling] = useState(false);
	const [showToast, setShowToast] = useState(false);

	// Generate a new name
	const rollName = useCallback(() => {
		if (isRolling) return;

		setIsRolling(true);

		// Generate new name immediately for the reels to target
		const newName = getRandomName();

		// Set the new name after animation completes
		setTimeout(() => {
			setCurrentName(newName);
			setIsRolling(false);
		}, 900); // Match the reel animation duration
	}, [isRolling]);

	// Copy name to clipboard
	const copyToClipboard = useCallback(async () => {
		if (isRolling) return;

		const fullName = `${currentName.adj} ${currentName.noun} ${currentName.emoji}`;

		try {
			await navigator.clipboard.writeText(fullName);
			setShowToast(true);

			// Hide toast after 1.2 seconds
			setTimeout(() => {
				setShowToast(false);
			}, 1200);
		} catch (err) {
			console.error('Failed to copy to clipboard:', err);

			setShowToast(true);
			setTimeout(() => {
				setShowToast(false);
			}, 1200);
		}
	}, [currentName, isRolling]);

	const fullName = `${currentName.adj} ${currentName.noun} ${currentName.emoji}`;

	return (
		<div className='min-h-screen bg-gray-950 flex items-center justify-center p-4'>
			{/* Animated background gradient */}
			<div className='absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-950 to-black'>
				<div className='absolute inset-0 bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-fuchsia-500/10 animate-pulse' />
			</div>

			{/* Main content */}
			<div className='relative z-10 w-full max-w-lg'>
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					className='bg-gray-900/80 backdrop-blur-sm rounded-3xl shadow-2xl p-10 text-center border border-gray-800/50'
					style={{
						boxShadow:
							'0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 100px -20px rgba(236, 72, 153, 0.1)',
					}}
				>
					{/* Header */}
					<motion.div
						initial={{ opacity: 0, y: -10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.2, duration: 0.4 }}
						className='mb-8'
					>
						<h1 className='text-4xl xl:text-4xl font-bold bg-gradient-to-r from-pink-500 to-fuchsia-600 bg-clip-text text-transparent mb-2'>
							Funny Startup Name
						</h1>
						<p className='text-gray-400 text-sm xl:text-base'>
							Roll for your next billion-dollar idea
						</p>
					</motion.div>

					{/* Emoji Logo */}
					<EmojiLogo emoji={currentName.emoji} />

					{/* Name Display */}
					<div className='mb-8'>
						<div className='space-y-2'>
							<NameReel
								targetWord={currentName.adj}
								isAdjective={true}
								isRolling={isRolling}
							/>
							<NameReel
								targetWord={currentName.noun}
								isAdjective={false}
								isRolling={isRolling}
							/>
						</div>
					</div>

					{/* Controls */}
					<Controls
						onRoll={rollName}
						onCopy={copyToClipboard}
						isRolling={isRolling}
						fullName={fullName}
					/>
				</motion.div>
			</div>

			{/* Toast notification */}
			<Toast isVisible={showToast} message='Copied to clipboard!' />
		</div>
	);
}

export default App;
