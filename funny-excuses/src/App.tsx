import { motion } from 'framer-motion';
import { useCallback, useState } from 'react';
import { actors, circumstances } from './data';

function App() {
	const [excuse, setExcuse] = useState({
		actor: '',
		circumstance: '',
	});
	const [userTask, setUserTask] = useState('');
	const [isAnimating, setIsAnimating] = useState(false);
	const [hasGenerated, setHasGenerated] = useState(false);

	const generateExcuse = useCallback(() => {
		if (isAnimating || !userTask.trim()) return;

		setIsAnimating(true);

		const randomActor = actors[Math.floor(Math.random() * actors.length)];
		const randomCircumstance =
			circumstances[Math.floor(Math.random() * circumstances.length)];

		setTimeout(() => {
			setExcuse({
				actor: randomActor,
				circumstance: randomCircumstance,
			});
			setIsAnimating(false);
			setHasGenerated(true);
		}, 400);
	}, [isAnimating, userTask]);

	return (
		<main className='min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-8'>
			<div className='max-w-4xl w-full text-center'>
				<motion.h1
					className='text-5xl md:text-7xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600'
					initial={{ opacity: 0, y: -50 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
				>
					Funny Excuse Generator
				</motion.h1>

				<motion.div
					className='mb-12'
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.3, duration: 0.8 }}
				>
					<label
						htmlFor='task-input'
						className='block text-xl md:text-2xl mb-4 text-gray-300'
					>
						Why I can't{' '}
						<input
							id='task-input'
							type='text'
							value={userTask}
							onChange={e => setUserTask(e.target.value)}
							onKeyDown={e => {
								if (e.key === 'Enter') {
									generateExcuse();
								}
							}}
							placeholder='work, exercise, cook...'
							className='inline-block bg-gray-800 text-white px-4 py-2 rounded-lg border-2 border-purple-500 focus:border-pink-500 focus:outline-none min-w-[200px] mx-2'
							maxLength={50}
						/>{' '}
						today?
					</label>
				</motion.div>

				{hasGenerated && (
					<section
						className='bg-gray-800 rounded-2xl p-8 md:p-10 mb-12 shadow-2xl'
						aria-live='polite'
					>
						<motion.div
							className='text-2xl md:text-4xl leading-relaxed'
							key={`${excuse.actor}-${excuse.circumstance}`}
							initial={{ opacity: 0, y: 20 }}
							animate={{
								opacity: isAnimating ? 0 : 1,
								y: isAnimating ? 20 : 0,
							}}
							transition={{ duration: 0.3 }}
							role='status'
							aria-label='Generated excuse'
						>
							<span className='text-gray-300 mx-2'>{'Because'}</span>
							<span className='text-yellow-400 font-semibold'>
								{excuse.actor || '...'}{' '}
							</span>
							<span className='text-green-400 font-semibold'>
								{excuse.circumstance ? excuse.circumstance : '...'}
							</span>
						</motion.div>
					</section>
				)}

				<motion.button
					onClick={generateExcuse}
					disabled={isAnimating || !userTask.trim()}
					className='bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-4 px-8 md:py-6 md:px-12 rounded-full text-xl md:text-2xl disabled:scale-100 shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-purple-500 focus:ring-opacity-50'
					whileHover={{ scale: isAnimating || !userTask.trim() ? 1 : 1.05 }}
					whileTap={{ scale: isAnimating || !userTask.trim() ? 1 : 0.95 }}
					initial={{ opacity: 0, y: 50 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.4, duration: 0.4 }}
				>
					{isAnimating
						? 'Generating...'
						: !userTask.trim()
						? 'Enter a task'
						: hasGenerated
						? 'Generate Excuse'
						: 'Generate Excuse'}
				</motion.button>

				<motion.p
					className='mt-8 text-gray-500 text-lg'
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.6, duration: 0.4 }}
				>
					Enter what you can't do today, then generate your excuse!
				</motion.p>
			</div>
		</main>
	);
}

export default App;
