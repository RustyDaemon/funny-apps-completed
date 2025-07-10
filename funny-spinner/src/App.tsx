import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { Game } from './components/Game';
import { Wizard } from './components/Wizard';
import { PWAInstallBanner } from './components/ui/PWAInstallBanner';
import { ANIMATION_CONFIG, THEME_STYLES } from './constants';
import { LanguageProvider } from './contexts/LanguageContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { useTheme } from './hooks/useTheme';
import type { GameData } from './types';

// Inner app component that has access to theme context
function AppContent() {
	const [gameData, setGameData] = useState<GameData | null>(null);
	const { theme } = useTheme();

	const handleWizardComplete = (data: GameData) => {
		setGameData(data);
	};

	const handleRestart = () => {
		setGameData(null);
	};

	return (
		<div
			className={`App min-h-screen ${THEME_STYLES.backgrounds[theme]} transition-colors duration-300`}
		>
			{/* PWA Install Banner */}
			<PWAInstallBanner />

			<AnimatePresence mode='wait'>
				{gameData ? (
					<motion.div
						key='game'
						initial={{ opacity: 0, scale: 0.95 }}
						animate={{ opacity: 1, scale: 1 }}
						exit={{ opacity: 0, scale: 1.05 }}
						transition={ANIMATION_CONFIG.smooth}
						className='min-h-screen'
					>
						<Game gameData={gameData} onRestart={handleRestart} />
					</motion.div>
				) : (
					<motion.div
						key='wizard'
						initial={{ opacity: 0, scale: 0.95 }}
						animate={{ opacity: 1, scale: 1 }}
						exit={{ opacity: 0, scale: 1.05 }}
						transition={ANIMATION_CONFIG.smooth}
						className='min-h-screen'
					>
						<Wizard onComplete={handleWizardComplete} />
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}

function App() {
	return (
		<ThemeProvider>
			<LanguageProvider>
				<AppContent />
			</LanguageProvider>
		</ThemeProvider>
	);
}

export default App;
