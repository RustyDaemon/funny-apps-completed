import { motion } from 'framer-motion';
import { GAME_MODES } from '../constants/gameConstants';
import type { GameResult } from '../types/gameTypes';

type GameHistoryPanelProps = {
	gameHistory: GameResult[];
	showHistory: boolean;
	onShowClearDataPopup: () => void;
};

const GameHistoryPanel: React.FC<GameHistoryPanelProps> = ({
	gameHistory,
	showHistory,
	onShowClearDataPopup,
}) => {
	if (!showHistory) return null;

	return (
		<motion.div
			initial={{ height: 0, opacity: 0 }}
			animate={{ height: 'auto', opacity: 1 }}
			exit={{ height: 0, opacity: 0 }}
			transition={{ duration: 0.3 }}
			className='w-full max-w-md mt-2 overflow-hidden'
		>
			<div className='bg-white dark:bg-slate-800 rounded-lg shadow p-4 max-h-72 overflow-auto'>
				<h3 className='font-bold text-lg mb-3 text-center'>Recent Games</h3>

				{gameHistory.length === 0 ? (
					<p className='text-center text-slate-500 dark:text-slate-400'>
						No games played yet
					</p>
				) : (
					<div className='space-y-3'>
						{gameHistory.map((result, index) => (
							<motion.div
								key={index}
								initial={{ opacity: 0, y: -10 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: index * 0.1 }}
								className={`p-2 sm:p-3 rounded-lg text-sm ${
									result.isJackpot
										? 'bg-yellow-100 dark:bg-yellow-900/30 border-l-4 border-yellow-400'
										: 'bg-slate-100 dark:bg-slate-700/50'
								}`}
							>
								<div className='flex justify-between mb-1'>
									<span className='font-medium'>
										{GAME_MODES[result.mode].name}
									</span>
									<span className='text-slate-500 dark:text-slate-400'>
										{result.timestamp.toLocaleTimeString()}
									</span>
								</div>
								<div className='flex gap-0.5 sm:gap-1 flex-wrap'>
									{result.reels.map((row, rowIdx) => (
										<div key={rowIdx} className='flex'>
											{row.map((emoji, colIdx) => (
												<span
													key={colIdx}
													className='w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 flex items-center justify-center text-base sm:text-lg md:text-xl'
												>
													{emoji}
												</span>
											))}
										</div>
									))}
								</div>
								<div className='mt-1 flex justify-between items-center'>
									{result.isJackpot && (
										<span className='text-yellow-600 dark:text-yellow-400 font-medium'>
											🎉 Jackpot!
										</span>
									)}
									{result.coinsWon > 0 && (
										<span className='text-emerald-600 dark:text-emerald-400 font-medium'>
											+{result.coinsWon} coins
											{result.multiplier > 0 && (
												<span className='ml-1 text-xs opacity-80'>
													(x{result.multiplier.toFixed(1)})
												</span>
											)}
										</span>
									)}
								</div>
							</motion.div>
						))}
					</div>
				)}

				{gameHistory.length > 0 && (
					<div className='mt-4 pt-3 border-t border-slate-200 dark:border-slate-700 text-center'>
						<button
							onClick={onShowClearDataPopup}
							className='px-3 py-1.5 bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-800/50 
              text-red-700 dark:text-red-400 rounded text-xs font-medium transition-colors'
						>
							🗑️ Clear All Game Data
						</button>
					</div>
				)}
			</div>
		</motion.div>
	);
};

export default GameHistoryPanel;
