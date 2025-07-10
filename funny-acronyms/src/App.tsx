import { motion } from 'framer-motion';
import { useCallback, useState } from 'react';
import { Reel } from './components/Reel';
import { Toast } from './components/Toast';
import { adjectives, nouns } from './data/words';
import type { AppState } from './types';

function App() {
	const [state, setState] = useState<AppState>({
		acronym: '',
		picks: [],
	});
	const [isSpinning, setIsSpinning] = useState(false);
	const [showToast, setShowToast] = useState(false);
	const [spinningReels, setSpinningReels] = useState<Set<number>>(new Set());

	// Validate and parse acronym
	const parseAcronym = (input: string): string | null => {
		const cleaned = input.replace(/[^A-Za-z]/g, '').toUpperCase();
		if (cleaned.length < 3 || cleaned.length > 5) {
			return null;
		}
		return cleaned;
	};

	// Handle acronym input
	const handleAcronymChange = (input: string) => {
		const parsed = parseAcronym(input);
		if (parsed) {
			setState(prev => ({
				acronym: parsed,
				picks: parsed.split('').map((letter, index) => {
					// Keep existing pick if same letter and position
					const existingPick = prev.picks[index];
					if (existingPick && prev.acronym[index] === letter) {
						return existingPick;
					}
					// Generate new pick
					const adjIndex = Math.floor(
						Math.random() * adjectives[letter].length
					);
					const nounIndex = Math.floor(Math.random() * nouns[letter].length);
					return {
						index: adjIndex,
						word: `${adjectives[letter][adjIndex]} ${nouns[letter][nounIndex]}`,
						locked: false,
					};
				}),
			}));
		} else {
			setState(prev => ({ ...prev, acronym: input.toUpperCase() }));
		}
	};

	// Toggle lock for a specific reel
	const toggleLock = useCallback((index: number) => {
		setState(prev => ({
			...prev,
			picks: prev.picks.map((pick, i) =>
				i === index ? { ...pick, locked: !pick.locked } : pick
			),
		}));
	}, []);

	// Spin all unlocked reels
	const spinReels = useCallback(() => {
		if (isSpinning || !state.acronym || state.picks.length === 0) return;

		setIsSpinning(true);
		const unlockedIndices = state.picks
			.map((pick, index) => (pick.locked ? -1 : index))
			.filter(index => index !== -1);

		setSpinningReels(new Set(unlockedIndices));

		// Generate new picks for unlocked reels
		setState(prev => ({
			...prev,
			picks: prev.picks.map((pick, index) => {
				if (pick.locked) return pick;

				const letter = prev.acronym[index];
				const adjIndex = Math.floor(Math.random() * adjectives[letter].length);
				const nounIndex = Math.floor(Math.random() * nouns[letter].length);

				return {
					index: adjIndex,
					word: `${adjectives[letter][adjIndex]} ${nouns[letter][nounIndex]}`,
					locked: false,
				};
			}),
		}));

		// Stop spinning after staggered delays
		unlockedIndices.forEach((reelIndex, i) => {
			setTimeout(() => {
				setSpinningReels(prev => {
					const newSet = new Set(prev);
					newSet.delete(reelIndex);
					return newSet;
				});

				// Check if all reels have stopped
				if (i === unlockedIndices.length - 1) {
					setTimeout(() => {
						setIsSpinning(false);
					}, 100);
				}
			}, 1000 + i * 100); // 1s base + 0.1s stagger
		});
	}, [isSpinning, state.acronym, state.picks]);

	// Copy to clipboard
	const copyToClipboard = useCallback(async () => {
		if (!state.picks.length) return;

		const fullPhrase = state.picks.map(pick => pick.word).join(' ');
		try {
			await navigator.clipboard.writeText(fullPhrase);
			setShowToast(true);
			setTimeout(() => setShowToast(false), 1000);
		} catch (err) {
			console.error('Failed to copy to clipboard:', err);
		}
	}, [state.picks]);

	const isValidAcronym = parseAcronym(state.acronym) !== null;
	const hasError = state.acronym.length > 0 && !isValidAcronym;

	return (
		<div className='min-h-screen bg-gray-950 text-indigo-300 flex items-center justify-center p-4'>
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6 }}
				className='max-w-3xl w-[95vw] rounded-3xl shadow-2xl p-8 flex flex-col gap-6 bg-gray-900/50 backdrop-blur-sm border border-gray-800'
			>
				{/* Header */}
				<div className='text-center'>
					<motion.h1
						className='text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-2'
						initial={{ scale: 0.9 }}
						animate={{ scale: 1 }}
						transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
					>
						Funny Acronym Expander
					</motion.h1>
					<p className='text-indigo-400/80 text-lg'>
						Turn any 3-5 letter acronym into something hilarious!
					</p>
				</div>

				{/* Input Section */}
				<div className='flex flex-col gap-2'>
					<label htmlFor='acronym' className='text-indigo-400 font-medium'>
						Enter your acronym (3-5 letters):
					</label>
					<input
						id='acronym'
						type='text'
						value={state.acronym}
						onChange={e => handleAcronymChange(e.target.value)}
						placeholder='e.g., API, LOL, NASA'
						className={`w-full px-4 py-3 rounded-xl bg-gray-800/70 border-2 transition-colors font-mono text-xl tracking-wider ${
							hasError
								? 'border-red-500 text-red-400'
								: 'border-gray-700 focus:border-indigo-500 text-indigo-300'
						} focus:outline-none`}
						maxLength={5}
					/>
					{hasError && (
						<motion.p
							initial={{ opacity: 0, y: -10 }}
							animate={{ opacity: 1, y: 0 }}
							className='text-red-400 text-sm'
						>
							Please enter 3-5 letters only (A-Z)
						</motion.p>
					)}
				</div>

				{/* Reels Section */}
				{isValidAcronym && state.picks.length > 0 && (
					<motion.div
						initial={{ opacity: 0, scale: 0.9 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ delay: 0.3 }}
						className='space-y-6'
					>
						{/* Reels Grid */}
						<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 justify-items-center'>
							{state.picks.map((pick, index) => {
								const letter = state.acronym[index];
								const [adjective, noun] = pick.word.split(' ');

								return (
									<div key={`${letter}-${index}`} className='space-y-4'>
										<div className='text-center'>
											<div className='text-2xl font-bold text-indigo-400 mb-4'>
												{letter}
											</div>

											{/* Adjective Reel */}
											<div className='mb-3'>
												<div className='text-sm text-indigo-400/70 mb-1'>
													Adjective
												</div>
												<Reel
													letter=''
													words={adjectives[letter]}
													locked={pick.locked}
													onToggleLock={() => toggleLock(index)}
													isSpinning={spinningReels.has(index)}
													finalWord={adjective}
													onSpinComplete={() => {}}
												/>
											</div>

											{/* Noun Reel */}
											<div>
												<div className='text-sm text-indigo-400/70 mb-1'>
													Noun
												</div>
												<Reel
													letter=''
													words={nouns[letter]}
													locked={pick.locked}
													onToggleLock={() => toggleLock(index)}
													isSpinning={spinningReels.has(index)}
													finalWord={noun}
													onSpinComplete={() => {}}
												/>
											</div>
										</div>
									</div>
								);
							})}
						</div>

						{/* Result Display */}
						<motion.div
							className='bg-gray-800/50 rounded-2xl p-6 text-center'
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 0.5 }}
						>
							<h2 className='text-lg font-medium text-indigo-400 mb-2'>
								Your Expansion:
							</h2>
							<p className='text-2xl md:text-3xl font-bold text-white'>
								{state.picks.map(pick => pick.word).join(' ')}
							</p>
						</motion.div>

						{/* Action Buttons */}
						<div className='flex gap-4 justify-center'>
							<motion.button
								onClick={spinReels}
								disabled={isSpinning}
								className='px-8 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-800 disabled:opacity-50 rounded-xl font-bold text-white transition-colors flex items-center gap-2'
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
							>
								{isSpinning ? '🎰 Spinning...' : '🎰 SPIN'}
							</motion.button>

							<motion.button
								onClick={copyToClipboard}
								className='px-8 py-3 bg-green-600 hover:bg-green-700 rounded-xl font-bold text-white transition-colors flex items-center gap-2'
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
							>
								📋 COPY
							</motion.button>
						</div>
					</motion.div>
				)}
			</motion.div>

			{/* Toast Notification */}
			<Toast show={showToast} message='Copied to clipboard!' />
		</div>
	);
}

export default App;
