import React, { useEffect, useState } from 'react';
import { CommandContext } from '../types';

export const hackTime = async (context: CommandContext): Promise<void> => {
	const { addOutput, setIsRunning } = context;

	const hackingMessages = [
		'Initializing hack protocols...',
		'Scanning network topology...',
		'Bypassing firewall defenses...',
		'Injecting payload into mainframe...',
		'Escalating privileges...',
		'Accessing classified databases...',
		'Downloading sensitive files...',
		'Covering digital tracks...',
		'Finalizing infiltration...',
	];

	setIsRunning(true);

	const HackingSequence: React.FC = () => {
		const [currentMessage, setCurrentMessage] = useState('');
		const [messageIndex, setMessageIndex] = useState(0);
		const [charIndex, setCharIndex] = useState(0);
		const [isComplete, setIsComplete] = useState(false);

		useEffect(() => {
			if (messageIndex >= hackingMessages.length) {
				setTimeout(() => {
					setIsComplete(true);
					setIsRunning(false);
				}, 1000);
				return;
			}

			const currentFullMessage = hackingMessages[messageIndex];

			if (charIndex < currentFullMessage.length) {
				const timeout = setTimeout(() => {
					setCurrentMessage(prev => prev + currentFullMessage[charIndex]);
					setCharIndex(prev => prev + 1);
				}, 50 + Math.random() * 100); // Variable typing speed

				return () => clearTimeout(timeout);
			} else {
				// Move to next message after a pause
				const timeout = setTimeout(() => {
					setCurrentMessage('');
					setCharIndex(0);
					setMessageIndex(prev => prev + 1);
				}, 800);

				return () => clearTimeout(timeout);
			}
		}, [messageIndex, charIndex]);

		return (
			<div className='my-2'>
				{hackingMessages.slice(0, messageIndex).map((msg, idx) => (
					<div key={idx} className='text-green-400 mb-1'>
						{'>'} {msg}
					</div>
				))}
				{currentMessage && (
					<div className='text-green-400 mb-1'>
						{'>'} {currentMessage}
						<span className='blink'>▮</span>
					</div>
				)}
				{isComplete && (
					<div className='text-center my-4'>
						<div className='text-6xl text-emerald-500 font-bold animate-pulse'>
							🎯 MISSION ACCOMPLISHED 🎯
						</div>
						<div className='text-emerald-400 mt-2'>
							Access granted. Welcome to the mainframe.
						</div>
					</div>
				)}
			</div>
		);
	};

	addOutput(<HackingSequence />);
};
