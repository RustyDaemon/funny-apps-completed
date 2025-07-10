import React, { useEffect, useState } from 'react';
import { CommandContext } from '../types';

export const motivate = async (context: CommandContext): Promise<void> => {
	const { addOutput, setIsRunning } = context;

	const duration = 30;
	const quotes = [
		"You're doing amazing! Keep going! 💪",
		'Success is not final, failure is not fatal! 🚀',
		'The only way to do great work is to love what you do! ❤️',
		"Believe you can and you're halfway there! ⭐",
		"Don't watch the clock; do what it does. Keep going! ⏰",
		'The future belongs to those who believe in the beauty of their dreams! 🌟',
		'It is during our darkest moments that we must focus to see the light! 💡',
		'You are never too old to set another goal! 🎯',
		'The way to get started is to quit talking and begin doing! 🔥',
		'Innovation distinguishes between a leader and a follower! 👑',
	];

	setIsRunning(true);

	const MotivationSession: React.FC = () => {
		const [currentQuote, setCurrentQuote] = useState(quotes[0]);
		const [progress, setProgress] = useState(100);
		const [timeLeft, setTimeLeft] = useState(duration);

		useEffect(() => {
			// Quote rotation every 5 seconds
			const quoteInterval = setInterval(() => {
				setCurrentQuote(quotes[Math.floor(Math.random() * quotes.length)]);
			}, 4000);

			// Progress bar countdown
			const progressInterval = setInterval(() => {
				setProgress(prev => {
					const newProgress = prev - 100 / duration;
					return newProgress <= 0 ? 0 : newProgress;
				});
				setTimeLeft(prev => {
					const newTime = prev - 1;
					if (newTime <= 0) {
						setIsRunning(false);
						return 0;
					}
					return newTime;
				});
			}, 1000);

			return () => {
				clearInterval(quoteInterval);
				clearInterval(progressInterval);
			};
		}, []);

		if (timeLeft <= 0) {
			return (
				<div className='text-center my-4'>
					<div className='text-2xl text-emerald-400 mb-2'>
						🎉 Motivation Session Complete! 🎉
					</div>
					<div className='text-yellow-400'>
						You're ready to conquer the world!
					</div>
				</div>
			);
		}

		return (
			<div className='my-4'>
				<div className='text-center mb-4'>
					<div className='text-xl text-cyan-400 mb-2'>
						💪 Motivation Session Active
					</div>
					<div className='text-4xl text-center mb-4 animate-pulse'>
						{currentQuote}
					</div>
				</div>

				<div className='mb-2'>
					<div className='flex justify-between text-sm text-gray-400 mb-1'>
						<span>Time remaining: {timeLeft}s</span>
						<span>{Math.round(progress)}%</span>
					</div>
					<div className='w-full bg-gray-800 rounded-full h-3'>
						<div
							className='bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-1000'
							style={{ width: `${progress}%` }}
						/>
					</div>
				</div>
			</div>
		);
	};

	addOutput(<MotivationSession />);
};
