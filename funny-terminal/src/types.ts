import { ReactNode } from 'react';

export interface CommandContext {
	args: string[];
	flags: Record<string, string | boolean>;
	rawInput: string;
	addOutput: (output: string | ReactNode) => void;
	clearOutput: () => void;
	setIsRunning: (running: boolean) => void;
	isRunning: boolean;
	abortSignal: AbortSignal;
}

export interface Command {
	name: string;
	description: string;
	execute: (context: CommandContext) => Promise<void> | void;
}

export interface TerminalState {
	output: Array<{ id: string; content: string | ReactNode; timestamp: number }>;
	history: string[];
	historyIndex: number;
	currentInput: string;
	isRunning: boolean;
}

export interface Config {
	soundEnabled: boolean;
	maxHistoryLength: number;
}
