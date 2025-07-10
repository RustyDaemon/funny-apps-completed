import React, { useEffect, useState } from 'react';
import { CommandContext } from '../types';

export const matrixRain = async (context: CommandContext): Promise<void> => {
	const { addOutput, setIsRunning, abortSignal } = context;

	setIsRunning(true);

	const MatrixRain: React.FC = () => {
		const [matrix, setMatrix] = useState<string[][]>([]);

		const width = 80;
		const height = 20;
		const chars =
			'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

		useEffect(() => {
			const interval = setInterval(() => {
				if (abortSignal.aborted) {
					setIsRunning(false);
					return;
				}

				setMatrix(() => {
					const newMatrix = Array(height)
						.fill(null)
						.map(() => Array(width).fill(' '));

					// Create falling characters
					for (let col = 0; col < width; col++) {
						if (Math.random() < 0.1) {
							const char = chars[Math.floor(Math.random() * chars.length)];
							const row = Math.floor(Math.random() * height);
							newMatrix[row][col] = char;
						}
					}

					return newMatrix;
				});
			}, 150);

			return () => clearInterval(interval);
		}, []);

		return (
			<div className='my-2'>
				<div className='text-green-500 mb-2'>
					🔳 Matrix Rain Mode - Wake up, Neo... (Ctrl+C to exit)
				</div>
				<pre className='text-green-400 text-xs font-mono bg-black p-2 rounded'>
					{matrix.map((row, i) => (
						<div key={i} className='h-4 overflow-hidden'>
							{row.join('')}
						</div>
					))}
				</pre>
			</div>
		);
	};

	addOutput(<MatrixRain />);

	// Keep running until aborted
	return new Promise(resolve => {
		const checkAbort = () => {
			if (abortSignal.aborted) {
				setIsRunning(false);
				resolve();
			} else {
				setTimeout(checkAbort, 100);
			}
		};
		checkAbort();
	});
};
