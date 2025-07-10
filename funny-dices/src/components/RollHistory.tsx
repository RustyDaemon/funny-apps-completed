import { motion } from 'framer-motion';
import type { RollResult } from '../types';

interface RollHistoryProps {
	history: RollResult[];
	onClear: () => void;
}

export default function RollHistory({ history, onClear }: RollHistoryProps) {
	function getDiceColor(diceType: number): string {
		switch (diceType) {
			case 3:
				return 'bg-emerald-500 text-white';
			case 6:
				return 'bg-blue-500 text-white';
			case 12:
				return 'bg-violet-500 text-white';
			case 20:
				return 'bg-amber-500 text-white';
			default:
				return 'bg-gray-500 text-white';
		}
	}

	function formatTime(date: Date): string {
		return date.toLocaleTimeString('en-US', {
			hour12: false,
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit',
		});
	}

	function getDiceIcon(diceType: number): string {
		switch (diceType) {
			case 3:
				return 'D3';
			case 6:
				return 'D6';
			case 12:
				return 'D12';
			case 20:
				return 'D20';
			default:
				return '?';
		}
	}

	return (
		<div className='bg-slate-800/90 backdrop-blur-sm rounded-xl p-4 shadow-xl max-h-96 overflow-hidden border border-slate-700'>
			<div className='flex justify-between items-center mb-4'>
				<h2 className='text-lg font-semibold text-gray-100 flex items-center gap-2'>
					<span>📜</span>
					<span>Roll History</span>
				</h2>
				{history.length > 0 && (
					<button
						onClick={onClear}
						className='px-3 py-1.5 bg-red-600 hover:bg-red-700 text-red-100 rounded-md text-sm transition-colors duration-200 flex items-center gap-1'
						aria-label='Clear history'
					>
						<span>🗑️</span>
						<span>Clear</span>
					</button>
				)}
			</div>

			{history.length === 0 ? (
				<div className='text-center py-8'>
					<div className='text-5xl mb-3 opacity-40'>🎲</div>
					<p className='text-slate-400 italic text-sm leading-relaxed'>
						No rolls yet!
					</p>
				</div>
			) : (
				<div className='space-y-2 max-h-72 overflow-y-auto pr-1 history-scrollbar'>
					{history.map((roll, index) => (
						<motion.div
							key={roll.id}
							initial={{ opacity: 0, y: -10, scale: 0.95 }}
							animate={{ opacity: 1, y: 0, scale: 1 }}
							transition={{ duration: 0.2, delay: index * 0.05 }}
							className='bg-slate-700/80 rounded-lg p-3 flex items-center justify-between transition-all duration-200 hover:bg-slate-600/80 hover:translate-x-1 shadow border border-slate-600/50'
						>
							<div className='flex items-center gap-3'>
								<span
									className={`px-2.5 py-1.5 rounded-lg ${getDiceColor(
										roll.diceType
									)} font-mono text-sm font-bold shadow-sm`}
									aria-label={`Dice type ${roll.diceType}`}
								>
									{getDiceIcon(roll.diceType)}
								</span>
								<span className='font-bold text-white text-xl drop-shadow-sm'>
									{roll.result}
								</span>
							</div>
							<time className='text-xs text-slate-400 font-mono bg-slate-800/50 px-2 py-1 rounded'>
								{formatTime(roll.timestamp)}
							</time>
						</motion.div>
					))}
				</div>
			)}
		</div>
	);
}
