import { AnimatePresence, motion } from 'framer-motion';
import { useRef, useState } from 'react';
import { generateCouplet } from './data/couplets';
import { findRhymes } from './data/rhymes';

interface AppState {
	word: string;
	rhymes: string[];
	couplet: string;
}

function App() {
	const [state, setState] = useState<AppState>({
		word: '',
		rhymes: [],
		couplet: '',
	});
	const [inputValue, setInputValue] = useState('');
	const [isShaking, setIsShaking] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);

	const handleFindRhymes = () => {
		const cleanWord = inputValue.trim();

		if (!cleanWord || cleanWord.length < 2) {
			// Trigger shake animation for invalid input
			setIsShaking(true);
			setTimeout(() => setIsShaking(false), 500);
			return;
		}

		const rhymes = findRhymes(cleanWord, 3);
		setState({
			word: cleanWord,
			rhymes,
			couplet: '',
		});
	};

	const handleRapify = () => {
		if (state.rhymes.length >= 2) {
			const couplet = generateCouplet(
				state.word,
				state.rhymes[0],
				state.rhymes[1]
			);
			setState(prev => ({ ...prev, couplet }));
		}
	};

	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter') {
			handleFindRhymes();
		}
	};

	const gradients = [
		'from-purple-500 to-pink-500',
		'from-blue-500 to-cyan-500',
		'from-green-500 to-teal-500',
		'from-yellow-500 to-orange-500',
		'from-red-500 to-pink-500',
		'from-indigo-500 to-purple-500',
	];

	return (
		<div className='min-h-screen bg-gray-950 text-fuchsia-300 flex items-center justify-center p-4'>
			<motion.div
				className='bg-gray-900 rounded-3xl shadow-2xl w-[90vw] max-w-xl p-10 text-center'
				animate={isShaking ? { x: [-5, 5, -5, 5, 0] } : {}}
				transition={{ duration: 0.5 }}
			>
				<motion.h1
					className='text-4xl md:text-6xl font-bold mb-8 bg-gradient-to-r from-fuchsia-400 to-purple-400 bg-clip-text text-transparent'
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
				>
					Funny Rhyme
				</motion.h1>

				<motion.div
					className='mb-8'
					initial={{ opacity: 0, scale: 0.9 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ duration: 0.5, delay: 0.2 }}
				>
					<input
						ref={inputRef}
						type='text'
						value={inputValue}
						onChange={e => setInputValue(e.target.value)}
						onKeyPress={handleKeyPress}
						placeholder='Enter any English word...'
						className='w-full px-6 py-4 text-xl font-mono bg-gray-800 border-2 border-gray-700 rounded-2xl text-fuchsia-300 placeholder-gray-500 focus:border-fuchsia-500 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/20 transition-all duration-300'
						autoFocus
					/>
				</motion.div>

				<motion.button
					onClick={handleFindRhymes}
					className='mb-8 px-8 py-4 bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:from-fuchsia-500 hover:to-purple-500 text-white font-bold text-lg rounded-2xl shadow-lg hover:scale-105 active:scale-95'
					whileTap={{ scale: 0.95 }}
				>
					FIND RHYMES
				</motion.button>

				<AnimatePresence mode='wait'>
					{state.rhymes.length > 0 && (
						<motion.div
							key='rhymes'
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -20 }}
							transition={{ duration: 0.4 }}
							className='mb-8'
						>
							<motion.div
								className='flex flex-wrap justify-center gap-4 mb-6'
								variants={{
									hidden: { opacity: 0 },
									show: {
										opacity: 1,
										transition: {
											staggerChildren: 0.05,
										},
									},
								}}
								initial='hidden'
								animate='show'
							>
								{state.rhymes.map((rhyme, index) => (
									<motion.span
										key={rhyme}
										variants={{
											hidden: { opacity: 0, y: 20 },
											show: { opacity: 1, y: 0 },
										}}
										className={`px-6 py-3 bg-gradient-to-r ${
											gradients[index % gradients.length]
										} text-white font-semibold rounded-full shadow-lg`}
									>
										{rhyme}
									</motion.span>
								))}
							</motion.div>

							<motion.button
								onClick={handleRapify}
								className='px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-bold text-lg rounded-2xl shadow-lg hover:scale-105 active:scale-95'
								initial={{ opacity: 0, scale: 0.8 }}
								animate={{ opacity: 1, scale: 1 }}
								transition={{ duration: 0.3, delay: 0.2 }}
								whileTap={{ scale: 0.95 }}
							>
								CREATE COUPLET
							</motion.button>
						</motion.div>
					)}
				</AnimatePresence>

				<AnimatePresence>
					{state.couplet && (
						<motion.div
							key='couplet'
							initial={{ opacity: 0, scale: 0.8 }}
							animate={{ opacity: 1, scale: 1 }}
							exit={{ opacity: 0, scale: 0.8 }}
							transition={{
								type: 'spring',
								stiffness: 200,
								damping: 15,
							}}
							className='mt-8 p-6 bg-gradient-to-r from-gray-800 to-gray-700 rounded-2xl border border-gray-600'
						>
							<h3 className='text-xl font-bold mb-4 text-cyan-400'>
								🎤 Your couplet
							</h3>
							<p className='text-lg md:text-2xl font-mono leading-relaxed whitespace-pre-line'>
								{state.couplet}
							</p>
						</motion.div>
					)}
				</AnimatePresence>
			</motion.div>
		</div>
	);
}

export default App;
