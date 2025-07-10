import React, { useEffect, useState } from 'react';
import { CommandContext } from '../types';

export const cryptoMiner = async (context: CommandContext): Promise<void> => {
	const { addOutput, setIsRunning, abortSignal } = context;

	setIsRunning(true);

	const CryptoMiner: React.FC = () => {
		const [hashRate, setHashRate] = useState(0);
		const [totalHashes, setTotalHashes] = useState(0);
		const [blocksFound, setBlocksFound] = useState(0);
		const [earnings, setEarnings] = useState(0);
		const [currentHash, setCurrentHash] = useState('');

		useEffect(() => {
			const interval = setInterval(() => {
				if (abortSignal.aborted) {
					setIsRunning(false);
					return;
				}

				// Simulate mining
				const newHashRate = 1000 + Math.random() * 2000;
				setHashRate(newHashRate);
				setTotalHashes(prev => prev + Math.floor(newHashRate / 10));

				// Generate fake hash
				const hash = Array.from({ length: 8 }, () =>
					Math.floor(Math.random() * 16).toString(16)
				).join('');
				setCurrentHash(hash);

				// Random block found
				if (Math.random() < 0.05) {
					setBlocksFound(prev => prev + 1);
					setEarnings(prev => prev + 0.00001);
				}
			}, 500);

			return () => clearInterval(interval);
		}, []);

		return (
			<div className='my-2'>
				<div className='text-yellow-400 mb-2'>
					⛏️ FunnyCoin Miner v2.0 - Mining in progress...
				</div>
				<div className='bg-gray-900 p-3 rounded border text-sm'>
					<div className='text-green-400'>
						Hash Rate: {hashRate.toFixed(0)} H/s
					</div>
					<div className='text-blue-400'>
						Total Hashes: {totalHashes.toLocaleString()}
					</div>
					<div className='text-purple-400'>Blocks Found: {blocksFound}</div>
					<div className='text-yellow-400'>
						Earnings: {earnings.toFixed(8)} FTC
					</div>
					<div className='text-gray-400 mt-2'>
						Current Hash: {currentHash}000000...
					</div>
					<div className='text-cyan-400 mt-2'>
						{hashRate > 2000 ? '🔥 Mining hot!' : '❄️ Cooling down...'}
					</div>
				</div>
				<div className='text-gray-500 text-xs mt-2'>
					⚠️ This is a simulation. No real cryptocurrency is being mined.
				</div>
			</div>
		);
	};

	addOutput(<CryptoMiner />);

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
