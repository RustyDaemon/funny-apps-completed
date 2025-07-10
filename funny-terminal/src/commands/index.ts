import { Command } from '../types';
import { brewCoffee } from './brewCoffee';
import { cryptoMiner } from './cryptoMiner';
import { fortuneTeller } from './fortuneTeller';
import { hackTime } from './hackTime';
import { clear, help } from './help';
import { matrixRain } from './matrixRain';
import { motivate } from './motivate';
import { weatherMars } from './weatherMars';
import { zombieApocalypse } from './zombieApocalypse';

export const commands: Record<string, Command> = {
	brew: {
		name: 'brew',
		description: 'Brew coffee with progress bar (brew coffee --size grande)',
		execute: brewCoffee,
	},
	'hack-time': {
		name: 'hack-time',
		description: 'Dramatic hacking sequence',
		execute: hackTime,
	},
	weather: {
		name: 'weather',
		description: 'Get Mars weather forecast (weather mars)',
		execute: weatherMars,
	},
	motivate: {
		name: 'motivate',
		description: 'Show inspirational quotes (motivate --timer 30)',
		execute: motivate,
	},
	help: {
		name: 'help',
		description: 'Show available commands',
		execute: help,
	},
	clear: {
		name: 'clear',
		description: 'Clear the terminal screen',
		execute: clear,
	},
	matrix: {
		name: 'matrix',
		description: 'Enter the Matrix with falling characters',
		execute: matrixRain,
	},
	mine: {
		name: 'mine',
		description: 'Start cryptocurrency mining simulation',
		execute: cryptoMiner,
	},
	fortune: {
		name: 'fortune',
		description: 'Get your fortune told by the digital spirits',
		execute: fortuneTeller,
	},
	zombie: {
		name: 'zombie',
		description: 'Survive the zombie apocalypse simulation',
		execute: zombieApocalypse,
	},
};

export const getCommand = (name: string): Command | undefined => {
	return commands[name.toLowerCase()];
};

export const getCommandNames = (): string[] => {
	return Object.keys(commands);
};
