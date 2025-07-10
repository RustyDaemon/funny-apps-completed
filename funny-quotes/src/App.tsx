import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import type { Quote } from './data/quotes';
import { quotes } from './data/quotes';

type GameState = 'waiting' | 'revealed';

// Random words to use as alternatives (not from the quote)
const randomWords = [
	'pizza',
	'unicorn',
	'banana',
	'robot',
	'dragon',
	'sandwich',
	'rainbow',
	'ninja',
	'spaceship',
	'dinosaur',
	'chocolate',
	'tornado',
	'penguin',
	'butterfly',
	'volcano',
	'wizard',
	'treasure',
	'elephant',
	'snowflake',
	'thunder',
	'crystal',
	'monster',
	'castle',
	'ocean',
	'forest',
	'mountain',
	'adventure',
	'magic',
	'mystery',
	'legend',
	'galaxy',
	'comet',
	'phoenix',
	'griffin',
	'kraken',
	'sphinx',
	'goblin',
	'fairy',
	'vampire',
	'werewolf',
	'ghost',
	'zombie',
	'alien',
	'cyborg',
	'mutant',
	'superhero',
];

function App() {
	const [currentQuote, setCurrentQuote] = useState<Quote>(quotes[0]);
	const [displayWords, setDisplayWords] = useState<string[]>([]);
	const [alternativeWords, setAlternativeWords] = useState<string[]>([]);
	const [chosenWord, setChosenWord] = useState<string>('');
	const [gameState, setGameState] = useState<GameState>('waiting');
	const [showToast, setShowToast] = useState(false);

	useEffect(() => {
		initializeQuote();
	}, [currentQuote]);

	const initializeQuote = () => {
		const words = [...currentQuote.words];
		const blankWord = words[currentQuote.blankIndex];
		words[currentQuote.blankIndex] = '_____';
		setDisplayWords(words);

		// Generate alternative words (original word + random alternatives)
		const shuffledRandomWords = [...randomWords].sort(
			() => Math.random() - 0.5
		);
		const alternatives = [blankWord, ...shuffledRandomWords.slice(0, 7)];
		setAlternativeWords(alternatives.sort(() => Math.random() - 0.5));

		setGameState('waiting');
		setChosenWord('');
	};

	const handleTokenClick = (word: string) => {
		if (gameState !== 'waiting') return;

		const newDisplayWords = [...displayWords];
		newDisplayWords[currentQuote.blankIndex] = word;
		setDisplayWords(newDisplayWords);
		setChosenWord(word);
		setGameState('revealed');
	};

	const handleNextQuote = () => {
		const randomIndex = Math.floor(Math.random() * quotes.length);
		setCurrentQuote(quotes[randomIndex]);
	};

	const handleCopyMisQuote = async () => {
		const misQuote = displayWords.join(' ');
		try {
			await navigator.clipboard.writeText(misQuote);
			setShowToast(true);
			setTimeout(() => setShowToast(false), 2000);
		} catch (err) {
			console.error('Failed to copy text: ', err);
		}
	};

	const getOriginalQuote = () => {
		const words = [...currentQuote.words];
		return words.join(' ');
	};

	return (
		<div className='min-h-screen bg-gray-950 text-lime-300 relative'>
			{/* Main content container */}
			<div className='flex flex-col items-center justify-center min-h-screen p-4 py-8 relative z-10'>
				<div className='w-full max-w-4xl'>
					{/* Quote Card */}
					<motion.div
						className='mb-8'
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5 }}
					>
						<div className='bg-gray-900/80 backdrop-blur-sm rounded-3xl shadow-2xl p-6 md:p-8 border border-gray-700/50'>
							<div className='text-center mb-6 md:mb-8'>
								<motion.h1
									className='text-xl md:text-2xl lg:text-3xl font-bold mb-2 text-cyan-400'
									initial={{ scale: 0.9 }}
									animate={{ scale: 1 }}
									transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
								>
									Funny Quote Highlighter
								</motion.h1>
								<motion.p
									className='text-xs md:text-sm text-gray-400'
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									transition={{ delay: 0.4 }}
								>
									Click any word to fill the blank and create a funny mis-quote!
								</motion.p>
							</div>

							{/* Quote Display */}
							<div className='mb-8 md:mb-12'>
								<div className='text-base md:text-lg lg:text-xl leading-relaxed mb-6 md:mb-8 text-center'>
									<motion.div
										className='flex flex-wrap justify-center gap-1 mb-4 md:mb-6'
										initial={{ opacity: 0, y: 10 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ delay: 0.6, staggerChildren: 0.1 }}
									>
										{displayWords.map((word, index) => (
											<motion.span
												key={index}
												className={`inline-block px-0.5 py-1 rounded text-sm md:text-base ${
													index === currentQuote.blankIndex
														? chosenWord
															? 'bg-pink-400/20 text-pink-300 border border-pink-400'
															: 'text-pink-400 border border-pink-400/50 bg-pink-400/10'
														: 'text-lime-300'
												}`}
												initial={{ opacity: 0, scale: 0.8 }}
												animate={{ opacity: 1, scale: 1 }}
											>
												{word}
											</motion.span>
										))}
									</motion.div>

									{/* Alternative Words */}
									{gameState === 'waiting' && (
										<motion.div
											className='text-center'
											initial={{ opacity: 0, y: 20 }}
											animate={{ opacity: 1, y: 0 }}
											transition={{ delay: 0.5 }}
										>
											<p className='text-xs md:text-sm text-gray-400 mb-4'>
												Choose a word to replace "
												<span className='text-pink-400'>_____</span>":
											</p>
											<div className='flex flex-wrap justify-center gap-2 max-w-lg mx-auto'>
												{alternativeWords.map((word, index) => (
													<Token
														key={index}
														word={word}
														onClick={() => handleTokenClick(word)}
														disabled={gameState !== 'waiting'}
													/>
												))}
											</div>
										</motion.div>
									)}
								</div>

								{/* Original Quote Reveal */}
								<AnimatePresence>
									{gameState === 'revealed' && (
										<motion.div
											className='mb-6'
											initial={{ opacity: 0, y: 10 }}
											animate={{ opacity: 1, y: 0 }}
										>
											<div className='text-center'>
												<h2 className='text-lg md:text-xl font-semibold mb-4 md:mb-6 text-cyan-400'>
													Original Quote
												</h2>
												<motion.div
													className='text-sm md:text-base text-gray-400 italic'
													initial={{ opacity: 0 }}
													animate={{ opacity: 1 }}
												>
													"{getOriginalQuote()}"
												</motion.div>
											</div>
										</motion.div>
									)}
								</AnimatePresence>
							</div>

							{/* Action Buttons - At the bottom of the card */}
							<div className='flex flex-col sm:flex-row gap-3 md:gap-4 justify-center'>
								<motion.button
									className='px-6 md:px-8 py-3 md:py-4 rounded-xl font-semibold text-white text-sm md:text-base bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 shadow-lg hover:shadow-xl'
									onClick={handleNextQuote}
									whileHover={{ scale: 1.03 }}
									whileTap={{ scale: 0.95 }}
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
								>
									Next Quote
								</motion.button>

								<AnimatePresence>
									{gameState === 'revealed' && (
										<motion.button
											className='px-6 md:px-8 py-3 md:py-4 rounded-xl font-semibold text-white text-sm md:text-base bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 shadow-lg hover:shadow-xl'
											onClick={handleCopyMisQuote}
											whileHover={{ scale: 1.03 }}
											whileTap={{ scale: 0.95 }}
											initial={{ opacity: 0, y: 0 }}
											animate={{ opacity: 1, y: 0 }}
										>
											Copy Mis-Quote
										</motion.button>
									)}
								</AnimatePresence>
							</div>
						</div>
					</motion.div>
				</div>
			</div>

			{/* Toast Notification */}
			<AnimatePresence>
				{showToast && (
					<motion.div
						className='fixed bottom-8 right-8 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 z-50'
						initial={{ y: 100, opacity: 0 }}
						animate={{ y: 0, opacity: 1 }}
						exit={{ y: 100, opacity: 0 }}
						transition={{ type: 'spring', stiffness: 300 }}
					>
						<span className='text-xl'>✅</span>
						<span>Copied to clipboard!</span>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}

interface TokenProps {
	word: string;
	onClick: () => void;
	disabled: boolean;
}

function Token({ word, onClick, disabled }: TokenProps) {
	return (
		<motion.button
			className={`inline-flex items-center justify-center px-3 md:px-4 py-2 m-1 rounded-lg font-medium text-xs md:text-sm ${
				disabled
					? 'text-gray-500 cursor-not-allowed bg-gray-800/50 border border-gray-700'
					: 'text-lime-300 hover:text-white hover:bg-lime-400/20 cursor-pointer border border-lime-400/40 bg-gray-800/40 hover:border-lime-400/60 active:bg-lime-400/30'
			}`}
			onClick={onClick}
			disabled={disabled}
			initial={{ opacity: 0, scale: 0.8 }}
			animate={{ opacity: 1, scale: 1 }}
			whileHover={
				!disabled
					? {
							scale: 1.05,
							y: -2,
							boxShadow: '0 0 15px rgba(132, 204, 22, 0.4)',
					  }
					: {}
			}
			whileTap={
				!disabled
					? {
							scale: 0.95,
					  }
					: {}
			}
			transition={{
				duration: 0.15,
			}}
		>
			{word}
		</motion.button>
	);
}

export default App;
