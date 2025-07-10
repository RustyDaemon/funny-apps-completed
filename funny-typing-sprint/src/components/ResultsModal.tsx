import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import type { GameMetrics } from '../types/game';

interface ResultsModalProps {
	isOpen: boolean;
	metrics: GameMetrics;
	onClose: () => void;
}

export function ResultsModal({ isOpen, metrics, onClose }: ResultsModalProps) {
	const modalRef = useRef<HTMLDivElement>(null);
	const replayButtonRef = useRef<HTMLButtonElement>(null);

	useEffect(() => {
		if (isOpen) {
			// Focus the modal when it opens
			modalRef.current?.focus();
		}
	}, [isOpen]);

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (!isOpen) return;

			if (event.key === 'Escape') {
				onClose();
			}
		};

		document.addEventListener('keydown', handleKeyDown);
		return () => document.removeEventListener('keydown', handleKeyDown);
	}, [isOpen, onClose]);

	const getAccuracyColor = (accuracy: number) => {
		if (accuracy >= 95) return 'text-green-400';
		if (accuracy >= 85) return 'text-yellow-400';
		return 'text-red-400';
	};

	const getWpmColor = (wpm: number) => {
		if (wpm >= 60) return 'text-green-400';
		if (wpm >= 40) return 'text-yellow-400';
		return 'text-red-400';
	};

	return (
		<AnimatePresence>
			{isOpen && (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					className='fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4'
					onClick={e => e.target === e.currentTarget && onClose()}
				>
					<motion.div
						ref={modalRef}
						initial={{ scale: 0.8, opacity: 0 }}
						animate={{ scale: 1, opacity: 1 }}
						exit={{ scale: 0.8, opacity: 0 }}
						transition={{ type: 'spring', damping: 20, stiffness: 300 }}
						className='bg-gray-900 rounded-xl p-8 max-w-md w-full shadow-2xl border border-gray-700'
						tabIndex={-1}
						role='dialog'
						aria-labelledby='results-title'
						aria-describedby='results-description'
					>
						<div className='text-center'>
							<motion.div
								initial={{ scale: 0 }}
								animate={{ scale: 1 }}
								className='text-6xl mb-4'
							>
								🎯
							</motion.div>

							<h2
								id='results-title'
								className='text-3xl font-bold mb-6 text-white'
							>
								Time's Up!
							</h2>

							<div id='results-description' className='space-y-4 mb-8'>
								<div className='grid grid-cols-2 gap-4'>
									<div className='bg-gray-800 rounded-lg p-4'>
										<div
											className={`text-2xl font-bold ${getAccuracyColor(
												metrics.accuracy
											)}`}
										>
											{metrics.accuracy.toFixed(1)}%
										</div>
										<div className='text-sm text-gray-400'>Accuracy</div>
									</div>

									<div className='bg-gray-800 rounded-lg p-4'>
										<div
											className={`text-2xl font-bold ${getWpmColor(
												metrics.wpm
											)}`}
										>
											{metrics.wpm.toFixed(0)}
										</div>
										<div className='text-sm text-gray-400'>WPM</div>
									</div>

									<div className='bg-gray-800 rounded-lg p-4'>
										<div className='text-2xl font-bold text-purple-400'>
											{metrics.spm.toFixed(0)}
										</div>
										<div className='text-sm text-gray-400'>SPM</div>
									</div>

									<div className='bg-gray-800 rounded-lg p-4'>
										<div className='text-2xl font-bold text-red-400'>
											{metrics.errors}
										</div>
										<div className='text-sm text-gray-400'>Errors</div>
									</div>
								</div>

								<div className='bg-gray-800 rounded-lg p-4'>
									<div className='text-lg font-semibold text-blue-400'>
										{metrics.wordsTyped} words in {metrics.duration}s
									</div>
								</div>
							</div>

							<div className='flex gap-3 justify-center'>
								<motion.button
									ref={replayButtonRef}
									whileHover={{ scale: 1.05 }}
									whileTap={{ scale: 0.95 }}
									onClick={onClose}
									className='bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900'
									autoFocus
								>
									🔄 Close
								</motion.button>
							</div>

							<div className='mt-4 text-sm text-gray-500'>
								Press <kbd className='bg-gray-800 px-2 py-1 rounded'>Esc</kbd>{' '}
								to close
							</div>
						</div>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}
