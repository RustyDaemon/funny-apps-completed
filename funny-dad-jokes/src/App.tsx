import { motion } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';
import { getRandomJoke } from './data/jokes';

interface PrinterState {
	buffer: string;
	isPrinting: boolean;
}

const CHARS_PER_SECOND = 40;
const CHAR_DELAY = 1000 / CHARS_PER_SECOND;

export default function App() {
	const [state, setState] = useState<PrinterState>({
		buffer: '',
		isPrinting: false,
	});

	const intervalRef = useRef<number | null>(null);
	const terminalRef = useRef<HTMLDivElement>(null);
	const currentJokeRef = useRef<string>('');
	const charIndexRef = useRef<number>(0);

	const scrollToBottom = useCallback(() => {
		if (terminalRef.current) {
			terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
		}
	}, []);

	const stopPrinting = useCallback(() => {
		if (intervalRef.current) {
			clearInterval(intervalRef.current);
			intervalRef.current = null;
		}
		setState(prev => ({ ...prev, isPrinting: false }));
	}, []);

	const clearScreen = useCallback(() => {
		stopPrinting();
		setState(prev => ({ ...prev, buffer: '' }));
		if (terminalRef.current) {
			terminalRef.current.scrollTop = 0;
		}
	}, [stopPrinting]);

	const startPrinting = useCallback(() => {
		if (state.isPrinting) return;

		const joke = getRandomJoke();
		const newText = `\n> ${joke}\n`;
		currentJokeRef.current = newText;
		charIndexRef.current = 0;

		setState(prev => ({ ...prev, isPrinting: true }));

		intervalRef.current = setInterval(() => {
			const char = currentJokeRef.current[charIndexRef.current];
			if (!char) {
				stopPrinting();
				return;
			}

			setState(prev => ({ ...prev, buffer: prev.buffer + char }));
			charIndexRef.current++;

			// Auto-scroll to bottom after each character
			setTimeout(scrollToBottom, 10);
		}, CHAR_DELAY);
	}, [state.isPrinting, scrollToBottom, stopPrinting]);

	// Keyboard shortcuts
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.ctrlKey && e.key === 'c') {
				e.preventDefault();
				stopPrinting();
			} else if (e.ctrlKey && e.key === 'l') {
				e.preventDefault();
				clearScreen();
			} else if (e.key === 'Enter') {
				e.preventDefault();
				startPrinting();
			}
		};

		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, [stopPrinting, clearScreen, startPrinting]);

	// Cleanup on unmount
	useEffect(() => {
		return () => {
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
			}
		};
	}, []);

	return (
		<div className='min-h-screen bg-black p-4 flex items-center justify-center'>
			<motion.div
				initial={{ opacity: 0, scale: 0.95 }}
				animate={{ opacity: 1, scale: 1 }}
				transition={{ duration: 0.5 }}
				className='w-full max-w-4xl bg-emerald-950 rounded-lg border-2 border-emerald-700 shadow-2xl overflow-hidden printer-glow'
			>
				{/* Header */}
				<div className='bg-emerald-900 px-4 py-2 border-b border-emerald-700 flex items-center justify-between flex-wrap gap-2'>
					<h1 className='text-emerald-200 font-mono text-lg font-bold'>
						FUNNY DAD JOKE PRINTER v1.0
					</h1>
					<div className='flex gap-2 flex-wrap'>
						<button
							onClick={startPrinting}
							disabled={state.isPrinting}
							className='px-3 py-1 bg-emerald-700 hover:bg-emerald-600 disabled:bg-emerald-800 disabled:opacity-50 text-emerald-100 font-mono text-sm rounded transition-colors'
						>
							{state.isPrinting ? 'PRINTING...' : 'PRINT'}
						</button>
						<button
							onClick={stopPrinting}
							disabled={!state.isPrinting}
							className='px-3 py-1 bg-red-700 hover:bg-red-600 disabled:bg-red-800 disabled:opacity-50 text-red-100 font-mono text-sm rounded transition-colors'
						>
							STOP
						</button>
						<button
							onClick={clearScreen}
							className='px-3 py-1 bg-yellow-700 hover:bg-yellow-600 text-yellow-100 font-mono text-sm rounded transition-colors'
						>
							CLEAR
						</button>
					</div>
				</div>

				{/* Terminal */}
				<motion.div
					animate={state.isPrinting ? { x: [-0.3, 0.3, -0.3, 0] } : { x: 0 }}
					transition={{
						duration: 0.1,
						repeat: state.isPrinting ? Infinity : 0,
					}}
					className='relative'
				>
					<div
						ref={terminalRef}
						className='h-96 overflow-y-auto p-4 bg-emerald-950 text-emerald-200 font-mono text-sm leading-relaxed scrollbar-thin scrollbar-track-emerald-900 scrollbar-thumb-emerald-700 terminal-text courier-font'
					>
						<pre className='whitespace-pre-wrap break-words'>
							{state.buffer}
							{state.isPrinting && (
								<motion.span
									animate={{ opacity: [1, 0] }}
									transition={{ duration: 0.5, repeat: Infinity }}
									className='bg-emerald-200 text-emerald-950 px-1'
								>
									▋
								</motion.span>
							)}
						</pre>
					</div>
				</motion.div>

				{/* Footer */}
				<div className='bg-emerald-900 px-4 py-2 border-t border-emerald-700 text-emerald-300 font-mono text-xs'>
					<div className='flex justify-between items-center flex-wrap gap-2'>
						<div>Keys: ENTER=Print | Ctrl+C=Stop | Ctrl+L=Clear</div>
						<div className='flex items-center gap-2'>
							<div className='flex items-center gap-1'>
								<div
									className={`w-2 h-2 rounded-full ${
										state.isPrinting
											? 'bg-red-500 animate-pulse'
											: 'bg-emerald-500'
									}`}
								/>
								<span>{state.isPrinting ? 'PRINTING' : 'READY'}</span>
							</div>
						</div>
					</div>
				</div>
			</motion.div>
		</div>
	);
}
