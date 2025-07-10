import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { actors, circumstances, verbs } from './data/parts';

interface TheoryState {
	headline: string;
	depth: number;
	showCopyToast: boolean;
}

const createTheory = (previousHeadline?: string): string => {
	let newHeadline: string;

	do {
		const randomActor = actors[Math.floor(Math.random() * actors.length)];
		const randomVerb = verbs[Math.floor(Math.random() * verbs.length)];
		const randomCircumstance =
			circumstances[Math.floor(Math.random() * circumstances.length)];

		newHeadline = `${randomActor} ${randomVerb} ${randomCircumstance}.`;
	} while (newHeadline === previousHeadline && actors.length > 1);

	return newHeadline;
};

function App() {
	const [theory, setTheory] = useState<TheoryState>({
		headline: '',
		depth: 0,
		showCopyToast: false,
	});

	const generateNewTheory = () => {
		const newHeadline = createTheory(theory.headline);
		setTheory(prev => ({
			...prev,
			headline: newHeadline,
			depth: Math.min(prev.depth + 1, 40),
		}));
	};

	const copyToClipboard = async () => {
		if (!theory.headline) return;

		try {
			await navigator.clipboard.writeText(theory.headline);
			setTheory(prev => ({ ...prev, showCopyToast: true }));

			setTimeout(() => {
				setTheory(prev => ({ ...prev, showCopyToast: false }));
			}, 2000);
		} catch (err) {
			console.error('Failed to copy text: ', err);
		}
	};

	const resetDepth = () => {
		setTheory(prev => ({ ...prev, depth: 0 }));
	};

	// Apply brightness effect to body
	useEffect(() => {
		const brightness = Math.max(30, 100 - theory.depth * 4);
		document.body.style.filter = `brightness(${brightness}%)`;

		return () => {
			document.body.style.filter = '';
		};
	}, [theory.depth]);

	// Generate initial theory on mount
	useEffect(() => {
		const initialHeadline = createTheory();
		setTheory(prev => ({ ...prev, headline: initialHeadline }));
	}, []);

	return (
		<div className='min-h-screen bg-gray-950 flex items-center justify-center p-4 dark'>
			<div className='max-w-xl w-full bg-gray-900 rounded-3xl shadow-2xl p-8 border border-gray-800'>
				<div className='text-center space-y-8'>
					{/* Header */}
					<div>
						<h1 className='text-3xl font-bold text-pink-400 mb-2'>
							Funny Conspiracy Maker
						</h1>
						<p className='text-gray-400 text-sm'>
							Dive deeper into the rabbit hole with each theory
						</p>
					</div>

					{/* Theory Display */}
					<div className='min-h-[120px] flex items-center justify-center'>
						<AnimatePresence mode='wait'>
							{theory.headline && (
								<motion.div
									key={theory.headline}
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: -20 }}
									transition={{ duration: 0.35 }}
									className='text-center'
								>
									<p className='text-xl font-mono text-gray-100 leading-relaxed'>
										"{theory.headline}"
									</p>
								</motion.div>
							)}
						</AnimatePresence>
					</div>

					{/* Buttons */}
					<div className='space-y-4'>
						<div className='flex flex-col sm:flex-row gap-4'>
							<button
								onClick={generateNewTheory}
								className='flex-2/3 bg-pink-600 hover:bg-pink-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200 w-full sm:w-auto'
							>
								GENERATE THEORY
							</button>

							<button
								onClick={copyToClipboard}
								disabled={!theory.headline}
								className='flex-1 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-500 text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200 w-full sm:w-auto'
							>
								COPY
							</button>
						</div>
					</div>

					{/* Depth Indicator */}
					<div className='text-center'>
						<div className='flex flex-col sm:flex-row gap-4'>
							<p className='flex-2/3 text-gray-500 text-sm font-semibold py-3 px-6 rounded-xl transition-colors duration-200 w-full sm:w-auto'>
								Rabbit hole depth: {theory.depth}
							</p>
							<button
								onClick={resetDepth}
								className='flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 font-semibold py-2 px-6 rounded-xl transition-colors duration-200 w-full sm:w-auto'
							>
								RESET
							</button>
						</div>
					</div>
				</div>
			</div>

			{/* Copy Toast */}
			<AnimatePresence>
				{theory.showCopyToast && (
					<motion.div
						initial={{ opacity: 0, scale: 0.8, y: 50 }}
						animate={{ opacity: 1, scale: 1, y: 0 }}
						exit={{ opacity: 0, scale: 0.8, y: 50 }}
						transition={{ duration: 0.3 }}
						className='fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2'
					>
						<span className='text-xl'>✅</span>
						<span className='font-semibold'>Copied to clipboard!</span>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}

export default App;
