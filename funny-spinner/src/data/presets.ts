import type { Preset } from '../types';

export const PRESETS: Preset[] = [
	{
		id: 'yes-or-no',
		question: 'Yes or No?',
		answers: ['Yes', 'No', 'Maybe', 'Definitely not', 'Absolutely'],
	},
	{
		id: 'best-frameworks',
		question: 'What is the best framework?',
		answers: ['React', 'Go Gin', 'Blazor', 'Next.js', 'ASP.NET Core'],
	},
	{
		id: 'what-to-eat',
		question: 'What should we eat?',
		answers: ['Pizza', 'Sushi', 'Burger', 'Salad'],
	},
];
