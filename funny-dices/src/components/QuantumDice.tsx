import { useEffect, useRef, useState } from 'react';
import type { DiceType } from '../types';

interface QuantumDiceProps {
	diceType: DiceType;
	result: number | null;
	isRolling: boolean;
	showGlitch: boolean;
}

export default function QuantumDice({
	diceType,
	result,
	isRolling,
	showGlitch,
}: QuantumDiceProps) {
	const diceElement = useRef<HTMLDivElement>(null);
	const rollingIntervalRef = useRef<number | null>(null);

	// Dice face representations for each type
	const diceFaces = {
		3: Array.from({ length: 3 }, (_, i) => (i + 1).toString()),
		6: Array.from({ length: 6 }, (_, i) => (i + 1).toString()),
		12: Array.from({ length: 12 }, (_, i) => (i + 1).toString()),
		20: Array.from({ length: 20 }, (_, i) => (i + 1).toString()),
	};

	// Get the appropriate dice face symbol or number
	function getDiceFace(type: DiceType, value: number): string {
		const faces = diceFaces[type];
		return faces[value - 1] || value.toString();
	}

	// Generate random face for rolling animation
	function getRandomFace(type: DiceType): string {
		const randomValue = Math.floor(Math.random() * type) + 1;
		return getDiceFace(type, randomValue);
	}

	const [rollingFace, setRollingFace] = useState<string>(
		getRandomFace(diceType)
	);

	// Get dice colors based on type
	function getDiceColor(type: DiceType): string {
		switch (type) {
			case 3:
				return 'bg-emerald-500';
			case 6:
				return 'bg-blue-500';
			case 12:
				return 'bg-violet-500';
			case 20:
				return 'bg-amber-500';
			default:
				return 'bg-blue-500';
		}
	}

	// Get dice shadow color based on type
	function getDiceShadowColor(type: DiceType): string {
		switch (type) {
			case 3:
				return 'shadow-emerald-500/50';
			case 6:
				return 'shadow-blue-500/50';
			case 12:
				return 'shadow-violet-500/50';
			case 20:
				return 'shadow-amber-500/50';
			default:
				return 'shadow-blue-500/50';
		}
	}

	// Get dice size based on type
	function getDiceSize(type: DiceType): string {
		switch (type) {
			case 3:
				return 'w-28 h-28';
			case 6:
				return 'w-28 h-28';
			case 12:
				return 'w-32 h-32';
			case 20:
				return 'w-36 h-36';
			default:
				return 'w-28 h-28';
		}
	}

	// Set up and clean up the rolling animation
	useEffect(() => {
		if (isRolling) {
			rollingIntervalRef.current = window.setInterval(() => {
				setRollingFace(getRandomFace(diceType));
			}, 100);
		} else if (rollingIntervalRef.current) {
			clearInterval(rollingIntervalRef.current);
		}

		return () => {
			if (rollingIntervalRef.current) {
				clearInterval(rollingIntervalRef.current);
			}
		};
	}, [isRolling, diceType]);

	return (
		<div className='relative min-h-[200px] flex flex-col items-center space-y-4'>
			{/* Dice Type Label */}
			<div
				className={`inline-flex items-center gap-2 ${getDiceColor(
					diceType
				)} text-sm font-semibold text-white px-4 py-2 rounded-full shadow-lg`}
			>
				<span>🎲</span>
				<span>D{diceType}</span>
			</div>

			{/* Main Dice Display */}
			<div
				ref={diceElement}
				className={`${getDiceSize(diceType)} relative overflow-hidden
          flex items-center justify-center
          rounded-2xl
          border-4 border-white/20
          ${getDiceColor(diceType)}
          shadow-2xl ${getDiceShadowColor(
						diceType
					)} transform transition-all duration-300
          cursor-default select-none
          ${isRolling ? 'animate-spin' : ''}
          ${showGlitch ? 'animate-pulse' : ''}
          ${!isRolling ? 'hover:scale-110 hover:rotate-3' : ''}`}
				role='img'
				aria-label={
					isRolling
						? `Rolling D${diceType} dice`
						: result
						? `D${diceType} rolled ${result}`
						: `D${diceType} dice ready to roll`
				}
			>
				{/* Dice shine overlay */}
				<div className='absolute inset-0 bg-gradient-radial from-white/40 via-white/20 to-transparent pointer-events-none z-10'></div>
				<div className='absolute top-2 left-2 right-2 h-8 bg-gradient-to-r from-transparent via-white/30 to-transparent rounded-full blur-sm pointer-events-none z-20'></div>

				<div className='text-center relative z-30'>
					{isRolling ? (
						<div className='text-4xl sm:text-5xl font-bold text-white drop-shadow-lg'>
							{rollingFace}
						</div>
					) : result !== null ? (
						<div className='text-5xl sm:text-6xl font-bold text-white drop-shadow-lg'>
							{getDiceFace(diceType, result)}
						</div>
					) : (
						<div className='text-4xl sm:text-5xl font-bold text-white/70 drop-shadow-lg'>
							?
						</div>
					)}
				</div>

				{/* Quantum Effect Visualization */}
				{showGlitch && (
					<div className='absolute inset-0 pointer-events-none z-40'>
						<div className='absolute inset-0 bg-gradient-to-r from-purple-500/30 via-indigo-500/30 to-purple-500/30 animate-pulse rounded-2xl'></div>
						<div className='absolute inset-0 bg-white/20 animate-ping rounded-2xl'></div>
					</div>
				)}
			</div>
		</div>
	);
}
