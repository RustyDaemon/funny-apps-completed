import React, { useCallback, useEffect, useRef, useState } from 'react';
import { getCommand, getCommandNames } from './commands';
import { config } from './config';
import { CommandContext, TerminalState } from './types';
import { autoComplete, parseCommand } from './utils/parser';

const Terminal: React.FC = () => {
	const [state, setState] = useState<TerminalState>({
		output: [],
		history: [],
		historyIndex: -1,
		currentInput: '',
		isRunning: false,
	});

	const inputRef = useRef<HTMLInputElement>(null);
	const outputRef = useRef<HTMLDivElement>(null);
	const runningCommandRef = useRef<AbortController | null>(null);

	// Auto-scroll to bottom when new output is added
	useEffect(() => {
		if (outputRef.current) {
			outputRef.current.scrollTop = outputRef.current.scrollHeight;
		}
	}, [state.output]);

	// Focus input on mount and when not running
	useEffect(() => {
		if (!state.isRunning && inputRef.current) {
			inputRef.current.focus();
		}
	}, [state.isRunning]);

	const addOutput = useCallback((content: string | React.ReactNode) => {
		setState(prev => ({
			...prev,
			output: [
				...prev.output,
				{
					id: Date.now().toString() + Math.random(),
					content,
					timestamp: Date.now(),
				},
			],
		}));
	}, []);

	const clearOutput = useCallback(() => {
		setState(prev => ({
			...prev,
			output: [],
		}));
	}, []);

	const setIsRunning = useCallback((running: boolean) => {
		setState(prev => ({
			...prev,
			isRunning: running,
		}));
	}, []);

	const executeCommand = useCallback(
		async (input: string) => {
			if (!input.trim()) return;

			const parsed = parseCommand(input);

			// Clear terminal before each command execution (except 'clear' itself)
			if (parsed.command !== 'clear') {
				clearOutput();
			}

			// Add command to output
			addOutput(
				<div className='flex items-center mb-2'>
					<span className='text-green-400 mr-2'>➜</span>
					<span className='text-white'>funny-terminal</span>
					<span className='text-blue-400 mx-2'>~</span>
					<span className='text-gray-300'>{input}</span>
				</div>
			);

			// Add to history
			setState(prev => ({
				...prev,
				history: [...prev.history.slice(-config.maxHistoryLength + 1), input],
				historyIndex: -1,
				currentInput: '',
			}));

			const command = getCommand(parsed.command);

			if (!command) {
				addOutput(
					<div className='text-red-400 mb-2'>
						Command not found: {parsed.command}
						<br />
						Type 'help' to see available commands.
					</div>
				);
				return;
			}

			// Special handling for commands that need specific args

			if (parsed.command === 'brew' && parsed.args[0] !== 'coffee') {
				addOutput(
					<div className='text-yellow-400 mb-2'>Usage: brew coffee</div>
				);
				return;
			}

			if (parsed.command === 'weather' && parsed.args[0] !== 'mars') {
				addOutput(
					<div className='text-yellow-400 mb-2'>Usage: weather mars</div>
				);
				return;
			}

			// Create abort controller for long-running commands
			const abortController = new AbortController();
			runningCommandRef.current = abortController;

			// Create command context
			const context: CommandContext = {
				args: parsed.args,
				flags: parsed.flags,
				rawInput: parsed.rawInput,
				addOutput,
				clearOutput,
				setIsRunning,
				isRunning: false,
				abortSignal: abortController.signal,
			};

			try {
				setIsRunning(true);
				await command.execute(context);
			} catch (error) {
				if (error instanceof Error && error.name !== 'AbortError') {
					addOutput(
						<div className='text-red-400 mb-2'>Error: {error.message}</div>
					);
				}
			} finally {
				setIsRunning(false);
				runningCommandRef.current = null;
			}
		},
		[addOutput, clearOutput, setIsRunning]
	);

	const handleKeyDown = useCallback(
		(e: React.KeyboardEvent<HTMLInputElement>) => {
			if (
				state.isRunning &&
				(e.key === 'Escape' || (e.ctrlKey && e.key === 'c'))
			) {
				// Abort running command
				if (runningCommandRef.current) {
					runningCommandRef.current.abort();
					runningCommandRef.current = null;
				}
				setIsRunning(false);
				addOutput(
					<div className='text-yellow-400 mb-2'>^C Command interrupted</div>
				);
				return;
			}

			if (state.isRunning) return;

			switch (e.key) {
				case 'Enter':
					if (state.currentInput.trim()) {
						executeCommand(state.currentInput);
					}
					break;

				case 'ArrowUp':
					e.preventDefault();
					if (state.history.length > 0) {
						const newIndex =
							state.historyIndex === -1
								? state.history.length - 1
								: Math.max(0, state.historyIndex - 1);
						setState(prev => ({
							...prev,
							historyIndex: newIndex,
							currentInput: prev.history[newIndex] || '',
						}));
					}
					break;

				case 'ArrowDown':
					e.preventDefault();
					if (state.historyIndex >= 0) {
						const newIndex = state.historyIndex + 1;
						if (newIndex >= state.history.length) {
							setState(prev => ({
								...prev,
								historyIndex: -1,
								currentInput: '',
							}));
						} else {
							setState(prev => ({
								...prev,
								historyIndex: newIndex,
								currentInput: prev.history[newIndex],
							}));
						}
					}
					break;

				case 'Tab':
					e.preventDefault();
					const completed = autoComplete(state.currentInput, getCommandNames());
					if (completed !== state.currentInput) {
						setState(prev => ({
							...prev,
							currentInput: completed,
						}));
					}
					break;
			}
		},
		[state, executeCommand, addOutput, setIsRunning]
	);

	const handleInputChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			if (!state.isRunning) {
				setState(prev => ({
					...prev,
					currentInput: e.target.value,
					historyIndex: -1,
				}));
			}
		},
		[state.isRunning]
	);

	// Global keyboard shortcuts
	useEffect(() => {
		const handleGlobalKeyDown = (e: KeyboardEvent) => {
			if (
				state.isRunning &&
				(e.key === 'Escape' || (e.ctrlKey && e.key === 'c'))
			) {
				e.preventDefault();
				if (runningCommandRef.current) {
					runningCommandRef.current.abort();
					runningCommandRef.current = null;
				}
				setIsRunning(false);
				addOutput(
					<div className='text-yellow-400 mb-2'>^C Command interrupted</div>
				);
			}
		};

		document.addEventListener('keydown', handleGlobalKeyDown);
		return () => document.removeEventListener('keydown', handleGlobalKeyDown);
	}, [state.isRunning, addOutput, setIsRunning]);

	return (
		<div className='min-h-screen bg-gray-950 text-green-400 p-2 sm:p-4 font-mono'>
			<div className='max-w-4xl mx-auto'>
				{/* Header */}
				<div className='mb-4 sm:mb-6 text-center'>
					<h1 className='text-2xl sm:text-4xl font-bold text-emerald-400 mb-2 glow'>
						Funny Terminal
					</h1>
				</div>

				{/* Output */}
				<div
					ref={outputRef}
					className='mb-4 min-h-[300px] sm:min-h-[400px] max-h-[400px] sm:max-h-[600px] overflow-y-auto bg-gray-900 rounded-lg p-2 sm:p-4 border border-gray-800'
				>
					{state.output.length === 0 && (
						<div className='text-gray-500 text-center py-8'>
							<div className='mb-2'>Welcome to Funny Terminal!</div>
							<div className='text-xs sm:text-sm'>
								Type a command to get started.
							</div>
							<div className='text-cyan-400 text-xs sm:text-sm mt-2'>
								Try: <span className='font-bold'>help</span>,{' '}
								<span className='font-bold'>matrix</span>, or{' '}
								<span className='font-bold'>weather mars</span>
							</div>
						</div>
					)}

					{state.output.map(item => (
						<div key={item.id} className='mb-1'>
							{typeof item.content === 'string' ? (
								<pre className='whitespace-pre-wrap font-mono text-xs sm:text-sm'>
									{item.content}
								</pre>
							) : (
								item.content
							)}
						</div>
					))}
				</div>

				{/* Input */}
				<div className='flex items-center bg-gray-900 rounded-lg p-2 sm:p-4 border border-gray-800'>
					<span className='text-green-400 mr-1 sm:mr-2 text-sm sm:text-base'>
						➜
					</span>
					<span className='text-white mr-1 sm:mr-2 text-xs sm:text-sm hidden sm:inline'>
						funny-terminal
					</span>
					<span className='text-blue-400 mr-1 sm:mr-2 text-sm sm:text-base hidden sm:inline'>
						~
					</span>
					<input
						ref={inputRef}
						type='text'
						value={state.currentInput}
						onChange={handleInputChange}
						onKeyDown={handleKeyDown}
						disabled={state.isRunning}
						className='flex-1 bg-transparent text-white outline-none text-sm sm:text-base'
						placeholder={
							state.isRunning
								? 'Running... (Ctrl+C to stop)'
								: 'Type a command...'
						}
						autoComplete='off'
						spellCheck='false'
					/>
					<span className='text-white ml-1 blink text-sm sm:text-base'>▮</span>
				</div>

				{/* Footer */}
				<div className='mt-2 sm:mt-4 text-center text-xs text-gray-500'>
					<div className='md:block hidden'>
						Use ↑/↓ for history • Tab for autocomplete • Ctrl+C to stop
					</div>
					<div className='md:hidden mt-1'>
						↑/↓ history • Tab complete • Ctrl+C stop
					</div>
				</div>
			</div>
		</div>
	);
};

export default Terminal;
