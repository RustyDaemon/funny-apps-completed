import React, { useEffect, useState } from 'react';
import { playSound } from '../assets/sounds';
import { CommandContext } from '../types';

export const brewCoffee = async (context: CommandContext): Promise<void> => {
	const { addOutput, setIsRunning } = context;

	const size = 'medium';
	const sizeMultiplier = 2;
	const brewTime = Math.floor(3000 * sizeMultiplier); // 3-6 seconds

	setIsRunning(true);

	const ProgressBar: React.FC<{ duration: number }> = ({ duration }) => {
		const [progress, setProgress] = useState(0);

		useEffect(() => {
			const interval = setInterval(() => {
				setProgress(prev => {
					const next = prev + 100 / (duration / 100);
					return next >= 100 ? 100 : next;
				});
			}, 100);

			const timeout = setTimeout(() => {
				playSound('slurp');
				addOutput(<span className='text-emerald-400'>✔ Brewed!</span>);
				setIsRunning(false);
			}, duration);

			return () => {
				clearInterval(interval);
				clearTimeout(timeout);
			};
		}, [duration]);

		return (
			<div className='my-2'>
				<div className='text-cyan-400 mb-1'>☕ Brewing {size} coffee...</div>
				<div className='w-full bg-gray-800 rounded-full h-2'>
					<div
						className='bg-amber-500 h-2 rounded-full transition-all duration-100'
						style={{ width: `${progress}%` }}
					/>
				</div>
				<div className='text-xs text-gray-400 mt-1'>
					{Math.round(progress)}%
				</div>
			</div>
		);
	};

	addOutput(<ProgressBar duration={brewTime} />);
};
