import type { KeyboardEvent } from 'react';
import type { DiceType } from '../types';

interface DiceSelectorProps {
	currentDice: DiceType;
	onDiceChange: (diceType: DiceType) => void;
}

interface DiceOption {
	type: DiceType;
	label: string;
	description: string;
	color: string;
	bgColor: string;
}

export default function DiceSelector({
	currentDice,
	onDiceChange,
}: DiceSelectorProps) {
	const diceOptions: DiceOption[] = [
		{
			type: 3,
			label: 'D3',
			description: 'Quick choice (1-3)',
			color: 'text-white',
			bgColor: 'bg-emerald-500',
		},
		{
			type: 6,
			label: 'D6',
			description: 'Classic cube (1-6)',
			color: 'text-white',
			bgColor: 'bg-blue-500',
		},
		{
			type: 12,
			label: 'D12',
			description: 'Dodecahedron (1-12)',
			color: 'text-white',
			bgColor: 'bg-violet-500',
		},
		{
			type: 20,
			label: 'D20',
			description: 'Icosahedron (1-20)',
			color: 'text-white',
			bgColor: 'bg-amber-500',
		},
	];

	function selectDice(diceType: DiceType) {
		onDiceChange(diceType);
	}

	function handleKeydown(
		event: KeyboardEvent<HTMLButtonElement>,
		diceType: DiceType
	) {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			selectDice(diceType);
		}
	}

	return (
		<div className='mb-6' role='radiogroup' aria-label='Select dice type'>
			<h2 className='text-lg font-semibold mb-4 text-center text-purple-400'>
				Choose Your Dice
			</h2>
			<div className='grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4'>
				{diceOptions.map(dice => (
					<button
						key={dice.type}
						type='button'
						className={`p-3 sm:p-4 text-center transition-all duration-200 min-h-[100px] sm:min-h-[120px] flex flex-col justify-center cursor-pointer select-none
              bg-slate-800 border rounded-lg shadow-sm
              ${
								currentDice === dice.type
									? 'ring-2 ring-purple-500 ring-offset-2 ring-offset-slate-900 scale-105 bg-slate-700'
									: 'hover:bg-slate-700 hover:scale-[1.02] hover:-translate-y-0.5 hover:shadow-lg active:scale-[0.98]'
							}
              focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ring-offset-slate-900 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2`}
						onClick={() => selectDice(dice.type)}
						onKeyDown={e => handleKeydown(e, dice.type)}
						role='radio'
						aria-checked={currentDice === dice.type ? 'true' : 'false'}
						tabIndex={currentDice === dice.type ? 0 : -1}
					>
						{/* Dice Visual */}
						<div className='mb-2 transition-all duration-300'>
							<div
								className={`w-10 h-10 sm:w-12 sm:h-12 mx-auto rounded-lg ${dice.bgColor} ${dice.color}
                  flex items-center justify-center font-bold text-base sm:text-lg
                  hover:scale-110 transition-transform duration-300`}
							>
								{dice.label}
							</div>
						</div>

						{/* Dice Info */}
						<div className='text-center'>
							<p className='text-xs sm:text-sm text-slate-300 leading-tight'>
								{dice.description}
							</p>
						</div>
					</button>
				))}
			</div>
		</div>
	);
}
