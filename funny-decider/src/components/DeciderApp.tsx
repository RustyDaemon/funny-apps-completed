import { AnimatePresence, motion } from 'framer-motion';
import { useRef, useState } from 'react';
import { FaShoppingCart } from 'react-icons/fa';
import { FiHelpCircle } from 'react-icons/fi';
import { getRandomResponse } from '../utils/responses';
import Result from './Result';
import StarRating from './StarRating';
import ThinkingAnimation from './ThinkingAnimation';

const DeciderApp = () => {
	const [item, setItem] = useState('');
	const [desireLevel, setDesireLevel] = useState(0);
	const [appState, setAppState] = useState<'INPUT' | 'THINKING' | 'RESULT'>(
		'INPUT'
	);
	const [result, setResult] = useState({ text: '', emoji: '' });
	const inputRef = useRef<HTMLInputElement>(null);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (item.trim() === '' || desireLevel === 0) return;

		setAppState('THINKING');

		// Simulate thinking process
		const thinkingTime = Math.floor(Math.random() * 3000) + 3500; // 3.5-6.5 seconds

		setTimeout(() => {
			setResult(getRandomResponse());
			setAppState('RESULT');
		}, thinkingTime);
	};

	const resetForm = () => {
		setItem('');
		setDesireLevel(0);
		setAppState('INPUT');
		setTimeout(() => inputRef.current?.focus(), 100);
	};

	return (
		<div className='w-full max-w-lg mx-auto p-4'>
			<motion.header
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className='mb-8 text-center'
			>
				<motion.div
					className='flex items-center justify-center gap-3 mb-2'
					initial={{ scale: 0 }}
					animate={{ scale: 1 }}
					transition={{ delay: 0.2, type: 'spring' }}
				>
					<FaShoppingCart className='text-[rgb(var(--primary))]' size={32} />
					<h1 className='text-4xl font-bold'>Funny Decider</h1>
				</motion.div>
			</motion.header>

			<AnimatePresence mode='wait'>
				{appState === 'INPUT' && (
					<motion.div
						key='input'
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -20 }}
						transition={{ duration: 0.3 }}
					>
						<div className='card'>
							<form onSubmit={handleSubmit}>
								<div className='mb-6'>
									<label className='block mb-2 text-sm font-medium'>
										What are you thinking of buying?
									</label>

									<div className='flex items-center border-b-2 border-[rgb(var(--border))] pb-2'>
										<span className='text-[rgb(var(--primary))] font-medium mr-2'>
											I want to buy
										</span>
										<input
											ref={inputRef}
											type='text'
											value={item}
											onChange={e => setItem(e.target.value)}
											className='flex-1 bg-transparent focus:outline-none'
											placeholder='amazing new shoes'
											autoFocus
										/>
									</div>
								</div>

								<div className='mb-6'>
									<label className='block mb-2 text-sm font-medium text-center'>
										How badly do you want it?
									</label>
									<StarRating value={desireLevel} onChange={setDesireLevel} />
								</div>

								<motion.button
									type='submit'
									disabled={!item || desireLevel === 0}
									className='btn btn-primary w-full flex items-center justify-center'
									whileHover={{ scale: 1.02 }}
									whileTap={{ scale: 0.98 }}
								>
									<FiHelpCircle className='mr-2' />
									Help Me Decide
								</motion.button>
							</form>
						</div>
					</motion.div>
				)}

				{appState === 'THINKING' && (
					<motion.div
						key='thinking'
						className='card text-center'
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ duration: 0.0 }}
					>
						<h2 className='text-xl font-medium mb-4'>
							Consulting with shopping experts...
						</h2>
						<ThinkingAnimation />
						<p className='text-sm opacity-75 mt-2'>
							This is a very serious decision...
						</p>
					</motion.div>
				)}

				{appState === 'RESULT' && (
					<motion.div
						key='result'
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ duration: 0.3 }}
					>
						<Result
							text={result.text}
							emoji={result.emoji}
							onReset={resetForm}
						/>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
};

export default DeciderApp;
