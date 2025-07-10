import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';
import { ANIMATION_CONFIG } from '../../constants';
import { usePWA } from '../../hooks/usePWA';
import { useTheme } from '../../hooks/useTheme';

export const PWAInstallBanner: React.FC = () => {
	const { theme } = useTheme();
	const { canInstall, isOffline, updateAvailable, installApp, updateApp } =
		usePWA();
	const [showInstallBanner, setShowInstallBanner] = React.useState(true);
	const [showUpdateBanner, setShowUpdateBanner] = React.useState(true);

	const handleInstall = async () => {
		const success = await installApp();
		if (success) {
			setShowInstallBanner(false);
		}
	};

	const handleUpdate = async () => {
		await updateApp();
		setShowUpdateBanner(false);
	};

	const handleDismissInstall = () => {
		setShowInstallBanner(false);
		// Remember dismissal for this session
		sessionStorage.setItem('pwa-install-dismissed', 'true');
	};

	// Don't show install banner if previously dismissed in this session
	React.useEffect(() => {
		const dismissed = sessionStorage.getItem('pwa-install-dismissed');
		if (dismissed) {
			setShowInstallBanner(false);
		}
	}, []);

	return (
		<>
			{/* Install Banner */}
			<AnimatePresence>
				{canInstall && showInstallBanner && (
					<motion.div
						initial={{ y: -100, opacity: 0 }}
						animate={{ y: 0, opacity: 1 }}
						exit={{ y: -100, opacity: 0 }}
						transition={ANIMATION_CONFIG.spring}
						className={`fixed top-0 left-0 right-0 z-50 ${
							theme === 'light'
								? 'bg-blue-600 text-white'
								: 'bg-blue-700 text-blue-100'
						} shadow-lg`}
					>
						<div className='max-w-6xl mx-auto px-4 py-3 flex items-center justify-between'>
							<div className='flex items-center space-x-3'>
								<span className='text-2xl'>📱</span>
								<div>
									<p className='font-semibold text-sm md:text-base'>
										Install Funny Spinner
									</p>
									<p className='text-xs md:text-sm opacity-90'>
										Get quick access and work offline!
									</p>
								</div>
							</div>

							<div className='flex items-center space-x-2'>
								<motion.button
									onClick={handleInstall}
									className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
										theme === 'light'
											? 'bg-white text-blue-600 hover:bg-blue-50'
											: 'bg-blue-800 text-blue-100 hover:bg-blue-900'
									}`}
									whileHover={{ scale: 1.05 }}
									whileTap={{ scale: 0.95 }}
								>
									Install
								</motion.button>

								<motion.button
									onClick={handleDismissInstall}
									className='p-2 hover:bg-white/10 rounded-lg transition-colors'
									whileHover={{ scale: 1.1 }}
									whileTap={{ scale: 0.9 }}
								>
									<span className='sr-only'>Close</span>✕
								</motion.button>
							</div>
						</div>
					</motion.div>
				)}
			</AnimatePresence>

			{/* Update Banner */}
			<AnimatePresence>
				{updateAvailable && showUpdateBanner && (
					<motion.div
						initial={{ y: 100, opacity: 0 }}
						animate={{ y: 0, opacity: 1 }}
						exit={{ y: 100, opacity: 0 }}
						transition={ANIMATION_CONFIG.spring}
						className={`fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 z-50 ${
							theme === 'light'
								? 'bg-green-600 text-white'
								: 'bg-green-700 text-green-100'
						} rounded-lg shadow-lg`}
					>
						<div className='p-4'>
							<div className='flex items-center space-x-3 mb-3'>
								<span className='text-xl'>🎉</span>
								<div>
									<p className='font-semibold text-sm'>Update Available!</p>
									<p className='text-xs opacity-90'>
										New features and improvements
									</p>
								</div>
							</div>

							<div className='flex space-x-2'>
								<motion.button
									onClick={handleUpdate}
									className={`flex-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
										theme === 'light'
											? 'bg-white text-green-600 hover:bg-green-50'
											: 'bg-green-800 text-green-100 hover:bg-green-900'
									}`}
									whileHover={{ scale: 1.02 }}
									whileTap={{ scale: 0.98 }}
								>
									Update Now
								</motion.button>

								<motion.button
									onClick={() => setShowUpdateBanner(false)}
									className='px-3 py-2 text-sm hover:bg-white/10 rounded-lg transition-colors'
									whileHover={{ scale: 1.05 }}
									whileTap={{ scale: 0.95 }}
								>
									Later
								</motion.button>
							</div>
						</div>
					</motion.div>
				)}
			</AnimatePresence>

			{/* Offline Indicator */}
			<AnimatePresence>
				{isOffline && (
					<motion.div
						initial={{ scale: 0, opacity: 0 }}
						animate={{ scale: 1, opacity: 1 }}
						exit={{ scale: 0, opacity: 0 }}
						transition={ANIMATION_CONFIG.bounce}
						className='fixed top-4 left-1/2 transform -translate-x-1/2 z-40'
					>
						<div
							className={`px-4 py-2 rounded-full shadow-lg ${
								theme === 'light'
									? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
									: 'bg-yellow-900/50 text-yellow-200 border border-yellow-700'
							}`}
						>
							<div className='flex items-center space-x-2'>
								<span className='w-2 h-2 bg-yellow-500 rounded-full animate-pulse'></span>
								<span className='text-sm font-medium'>Offline Mode</span>
							</div>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</>
	);
};
