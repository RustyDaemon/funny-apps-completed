import { AnimatePresence, motion } from 'framer-motion';
import FreeCoinsPopup from './components/FreeCoinsPopup';
import GameHistoryPanel from './components/GameHistoryPanel';
import JackpotPopup from './components/JackpotPopup';
import Popup from './components/Popup';
import Reel from './components/Reel';
import {
	GAME_MODES,
	MAX_HISTORY_SIZE,
	MULTIPLIERS,
	SPIN_COST,
} from './constants/gameConstants';
import useGameState from './hooks/useGameState';

// The main game component
export default function App() {
	const {
		// Game state
		gameMode,
		setGameMode,
		reels,
		isSpinning,
		isJackpot,
		shake,
		spinCount,
		lastJackpot,
		showHistory,
		setShowHistory,

		// Game data
		coins,
		gameHistory,
		totalGamesPlayed,

		// Popup states
		showFreeCoinsPopup,
		showCleanupPopup,
		showClearDataPopup,
		setShowClearDataPopup,
		freeCoinsAmount,

		// Functions
		spin,
		closeJackpotPopup,
		claimFreeCoins,
		cleanupOldHistory,
		clearAllGameData,
	} = useGameState();

	return (
		<div
			className='min-h-screen bg-gradient-to-br from-purple-50 to-blue-100 
                dark:from-slate-900 dark:to-indigo-950 
                text-slate-900 dark:text-white overflow-x-hidden'
		>
			<div className='container mx-auto px-2 sm:px-4 py-2 flex flex-col items-center justify-start min-h-screen'>
				{/* Title with floating animation */}
				<h1
					className='text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 text-center 
                     bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 
                     bg-clip-text text-transparent animate-float mt-4'
				>
					Funny Emoji Slots
				</h1>

				{/* Game Mode Selector */}
				<div className='flex flex-wrap justify-center gap-1.5 sm:gap-2 mb-4 sm:mb-6'>
					{Object.entries(GAME_MODES).map(([key, mode]) => (
						<button
							key={key}
							onClick={() => setGameMode(key as typeof gameMode)}
							disabled={isSpinning}
							className={`px-3 py-1 rounded-full text-sm font-medium transition-all
                ${
									gameMode === key
										? 'bg-indigo-600 text-white shadow-md scale-105'
										: 'bg-indigo-100 dark:bg-slate-700 text-indigo-700 dark:text-indigo-200'
								}`}
						>
							{mode.name}
						</button>
					))}
				</div>

				{/* Game mode description */}
				<div className='text-sm text-center mb-2 text-slate-500 dark:text-slate-400 flex flex-col items-center'>
					<p>{GAME_MODES[gameMode].description}</p>
					<span
						className='mt-1 inline-block px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900/40 
                       text-indigo-700 dark:text-indigo-300 text-xs font-medium'
					>
						Jackpot x{MULTIPLIERS.jackpot[gameMode]} multiplier
					</span>
				</div>

				{/* Game information */}
				<div className='text-sm text-center mb-6 text-slate-600 dark:text-slate-300'>
					<div className='flex flex-wrap items-center justify-center gap-4'>
						<p className='flex items-center'>
							<svg
								xmlns='http://www.w3.org/2000/svg'
								className='h-5 w-5 mr-1 text-yellow-500'
								viewBox='0 0 20 20'
								fill='currentColor'
							>
								<path
									fillRule='evenodd'
									d='M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z'
									clipRule='evenodd'
								/>
							</svg>
							Spins: {spinCount}
						</p>
						<p className='flex items-center font-medium'>
							<svg
								xmlns='http://www.w3.org/2000/svg'
								className='h-5 w-5 mr-1 text-amber-500'
								viewBox='0 0 20 20'
								fill='currentColor'
							>
								<path d='M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z' />
								<path
									fillRule='evenodd'
									d='M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z'
									clipRule='evenodd'
								/>
							</svg>
							Coins:{' '}
							<span
								className={`ml-1 ${
									coins < SPIN_COST ? 'text-red-500' : 'text-green-500'
								}`}
							>
								{coins}
							</span>
						</p>
						{lastJackpot && (
							<p className='flex items-center'>
								<span className='text-yellow-500 mr-1'>⭐</span>
								Last Jackpot: {lastJackpot}
							</p>
						)}
						<p className='flex items-center'>
							<svg
								xmlns='http://www.w3.org/2000/svg'
								className='h-5 w-5 mr-1 text-blue-500'
								viewBox='0 0 20 20'
								fill='currentColor'
							>
								<path
									fillRule='evenodd'
									d='M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z'
									clipRule='evenodd'
								/>
							</svg>
							Total Games: {totalGamesPlayed}
						</p>
					</div>
					<p className='text-xs mt-1 opacity-70'>
						Each spin costs {SPIN_COST} coins
					</p>
				</div>

				{/* Slot machine casing */}
				<div
					className='bg-gradient-to-b from-indigo-600 to-purple-700 dark:from-slate-800 dark:to-slate-950 
                    p-3 sm:p-4 md:p-5 rounded-2xl shadow-2xl mb-6 sm:mb-8 border-4 sm:border-8 border-indigo-300 dark:border-slate-700
                    max-w-full overflow-auto'
				>
					{/* Reels container - adjusted for different game modes */}
					<div className='bg-white dark:bg-slate-800 rounded-xl p-2 sm:p-4 shadow-inner'>
						{reels.map((rowReels, rowIndex) => (
							<motion.div
								key={rowIndex}
								className='flex space-x-2 sm:space-x-4 mb-2 last:mb-0'
								animate={shake ? { x: [-10, 10, -10, 10, -5, 5, 0] } : {}}
								transition={{ duration: 0.5, ease: 'easeInOut' }}
							>
								{rowReels.map((emoji, colIndex) => (
									<Reel
										key={`${rowIndex}-${colIndex}`}
										emoji={emoji}
										isSpinning={isSpinning}
										index={rowIndex * rowReels.length + colIndex}
										mode={gameMode}
									/>
								))}
							</motion.div>
						))}
					</div>
				</div>

				{/* Spin button with pulsing effect when idle */}
				<motion.button
					whileHover={{ scale: coins >= SPIN_COST ? 1.05 : 1 }}
					whileTap={{ scale: coins >= SPIN_COST ? 0.95 : 1 }}
					onClick={spin}
					disabled={isSpinning || coins < SPIN_COST}
					className={`relative overflow-hidden text-white font-bold py-4 px-8 rounded-full text-2xl
                     shadow-lg ${
												isSpinning
													? 'bg-gray-500 cursor-not-allowed'
													: coins < SPIN_COST
													? 'bg-gray-400 cursor-not-allowed'
													: 'bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700'
											}`}
				>
					{isSpinning ? (
						<span className='flex items-center justify-center'>
							<svg
								className='animate-spin -ml-1 mr-3 h-5 w-5 text-white'
								xmlns='http://www.w3.org/2000/svg'
								fill='none'
								viewBox='0 0 24 24'
							>
								<circle
									className='opacity-25'
									cx='12'
									cy='12'
									r='10'
									stroke='currentColor'
									strokeWidth='4'
								></circle>
								<path
									className='opacity-75'
									fill='currentColor'
									d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
								></path>
							</svg>
							Spinning...
						</span>
					) : coins < SPIN_COST ? (
						<span className='flex items-center'>
							<svg
								xmlns='http://www.w3.org/2000/svg'
								className='h-5 w-5 mr-2'
								fill='none'
								viewBox='0 0 24 24'
								stroke='currentColor'
							>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={2}
									d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
								/>
							</svg>
							Need Coins
						</span>
					) : (
						<span className='flex items-center'>
							<svg
								xmlns='http://www.w3.org/2000/svg'
								className='h-5 w-5 mr-2'
								fill='none'
								viewBox='0 0 24 24'
								stroke='currentColor'
							>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={2}
									d='M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z'
								/>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={2}
									d='M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
								/>
							</svg>
							SPIN
						</span>
					)}
				</motion.button>

				{/* Free Coins Popup */}
				<AnimatePresence>
					{showFreeCoinsPopup && (
						<FreeCoinsPopup
							isOpen={showFreeCoinsPopup}
							coins={freeCoinsAmount}
							onClaim={claimFreeCoins}
						/>
					)}
				</AnimatePresence>

				{/* History Panel Toggle */}
				<button
					onClick={() => setShowHistory(!showHistory)}
					className='mt-6 text-sm flex items-center gap-2 text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-300 transition-colors'
				>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						width='16'
						height='16'
						viewBox='0 0 24 24'
						fill='none'
						stroke='currentColor'
						strokeWidth='2'
						strokeLinecap='round'
						strokeLinejoin='round'
					>
						<path d='M12 8v4l3 3'></path>
						<circle cx='12' cy='12' r='10'></circle>
					</svg>
					Game History {showHistory ? '▲' : '▼'}
				</button>

				{/* Game History Panel */}
				<AnimatePresence>
					{showHistory && (
						<GameHistoryPanel
							gameHistory={gameHistory}
							showHistory={showHistory}
							onShowClearDataPopup={() => setShowClearDataPopup(true)}
						/>
					)}
				</AnimatePresence>

				{/* Jackpot Popup */}
				<AnimatePresence>
					{isJackpot && (
						<JackpotPopup
							isOpen={isJackpot}
							onClose={closeJackpotPopup}
							gameMode={gameMode}
							lastJackpot={lastJackpot}
							spinCost={SPIN_COST}
						/>
					)}
				</AnimatePresence>

				{/* Cleanup Old History Popup */}
				<Popup
					isOpen={showCleanupPopup}
					onClose={() => cleanupOldHistory()}
					onConfirm={cleanupOldHistory}
					title='Clean Up Game History'
					confirmText='Yes, Clean Up'
					cancelText='No, Keep All'
					variant='info'
				>
					<p className='mb-2'>
						You have {gameHistory.length} saved games in history.
					</p>
					<p>
						Would you like to clean up and keep only the most recent{' '}
						{MAX_HISTORY_SIZE} games?
					</p>
				</Popup>

				{/* Clear All Data Popup */}
				<Popup
					isOpen={showClearDataPopup}
					onClose={() => setShowClearDataPopup(false)}
					onConfirm={clearAllGameData}
					title='Clear All Game Data'
					confirmText='Yes, Clear'
					cancelText='No, Keep My Data'
					variant='warning'
				>
					<p className='mb-2'>
						This will reset your game history to the latest 20 games.
					</p>
					<p>Are you sure you want to clear?</p>
				</Popup>
			</div>
		</div>
	);
}
