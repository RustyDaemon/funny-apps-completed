import { motion } from 'framer-motion';
import { useCallback, useEffect, useState } from 'react';
import { compliments } from './data/compliments';

function App() {
	const [currentCompliment, setCurrentCompliment] = useState<string>('');
	const [complimentKey, setComplimentKey] = useState<number>(0);

	const getRandomCompliment = useCallback(() => {
		const randomIndex = Math.floor(Math.random() * compliments.length);
		return compliments[randomIndex];
	}, []);

	const generateNewCompliment = useCallback(() => {
		setCurrentCompliment(getRandomCompliment());
		setComplimentKey((prev: number) => prev + 1);
	}, [getRandomCompliment]);

	useEffect(() => {
		// Generate initial compliment
		generateNewCompliment();
	}, [generateNewCompliment]);

	useEffect(() => {
		const handleKeyPress = (event: KeyboardEvent) => {
			if (event.code === 'Space') {
				event.preventDefault();
				generateNewCompliment();
			}
		};

		document.addEventListener('keydown', handleKeyPress);
		return () => document.removeEventListener('keydown', handleKeyPress);
	}, [generateNewCompliment]);

	return (
		<div className='min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4'>
			<div className='max-w-4xl w-full mx-auto text-center'>
				<div className='mb-12'>
					<h1 className='text-4xl md:text-6xl font-bold text-gray-800 mb-4'>
						Funny Compliments
					</h1>
					<p className='text-lg md:text-xl text-gray-600 max-w-2xl mx-auto'>
						Get wonderfully weird compliments that will make you smile.
					</p>
				</div>

				<div className='mb-12 min-h-[200px] flex items-center justify-center'>
					<div
						key={complimentKey}
						className='bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg shadow-indigo-100/50 p-8 md:p-12 max-w-3xl mx-auto border border-white/20'
					>
						<p className='text-2xl md:text-3xl lg:text-4xl text-gray-700 leading-relaxed font-medium italic'>
							"{currentCompliment}"
						</p>
					</div>
				</div>

				<motion.button
					onClick={generateNewCompliment}
					whileHover={{ scale: 1.03 }}
					whileTap={{ scale: 0.97 }}
					className='bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold text-xl px-12 py-4 rounded-full shadow-lg shadow-indigo-200/50 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-indigo-300/50'
					aria-label='Generate a new compliment'
				>
					Generate Compliment
				</motion.button>

				<p className='text-gray-500 mt-8 text-sm md:text-base'>
					Press{' '}
					<kbd className='px-2 py-1 bg-gray-200 rounded text-xs font-mono'>
						Space
					</kbd>{' '}
					or click the button for more compliments
				</p>
			</div>
		</div>
	);
}

export default App;
