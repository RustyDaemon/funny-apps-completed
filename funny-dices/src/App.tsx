import { useState } from 'react';
import DiceSelector from './components/DiceSelector';
import QuantumDice from './components/QuantumDice';
import RollHistory from './components/RollHistory';
import type { DiceType, RollResult } from './types';

function App() {
	const [currentDice, setCurrentDice] = useState<DiceType>(6);
	const [isRolling, setIsRolling] = useState(false);
	const [lastResult, setLastResult] = useState<number | null>(null);
	const [rollHistory, setRollHistory] = useState<RollResult[]>([]);
	const [showGlitch, setShowGlitch] = useState(false);

	const canRoll = !isRolling;

	function rollDice() {
		if (!canRoll) return;

		setIsRolling(true);
		setLastResult(null);

		// Random animation duration between 1-3 seconds
		const animationDuration = 1000 + Math.random() * 2000;

		// Show quantum glitch effect first
		setShowGlitch(true);
		setTimeout(() => {
			setShowGlitch(false);
		}, 600);

		// Generate result and finish roll
		setTimeout(() => {
			const result = generateRollResult(currentDice);
			setLastResult(result);
			setIsRolling(false);

			// Add to history
			const rollResult: RollResult = {
				id: crypto.randomUUID(),
				diceType: currentDice,
				result,
				timestamp: new Date(),
			};
			setRollHistory(prev => [rollResult, ...prev].slice(0, 50));
		}, animationDuration);
	}

	function generateRollResult(diceType: number): number {
		return Math.floor(Math.random() * diceType) + 1;
	}

	function clearHistory() {
		setRollHistory([]);
	}

	return (
		<main className='min-h-screen p-4 sm:p-6 lg:p-8'>
			<div className='max-w-6xl mx-auto'>
				{/* Header */}
				<header className='text-center mb-8 sm:mb-12'>
					<h1 className='mb-4 text-4xl sm:text-5xl font-bold relative'>
						{/* <span className='absolute -top-2 -left-2 sm:-top-3 sm:-left-3 text-2xl sm:text-3xl md:text-4xl inline-block transform hover:rotate-12 transition-transform'>
							🎲
						</span> */}
						<span className='bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-violet-300 to-indigo-400'>
							Funny Dice
						</span>
					</h1>
				</header>

				<div className='grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8'>
					{/* Main Game Area */}
					<div className='lg:col-span-2 space-y-6'>
						{/* Dice Selector */}
						<section>
							<DiceSelector
								currentDice={currentDice}
								onDiceChange={setCurrentDice}
							/>
						</section>

						{/* Dice Display */}
						<section className='text-center py-6 sm:py-8'>
							<QuantumDice
								diceType={currentDice}
								result={lastResult}
								isRolling={isRolling}
								showGlitch={showGlitch}
							/>

							<div className='mt-8 sm:mt-12 text-center'>
								<button
									type='button'
									className={`bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white text-lg sm:text-xl px-8 sm:px-10 py-4 sm:py-6 rounded-xl
                    disabled:opacity-50 disabled:cursor-not-allowed
                    shadow-lg hover:shadow-2xl
                    relative overflow-hidden
                    ${
											isRolling
												? 'animate-pulse scale-95'
												: 'hover:scale-105 active:scale-95'
										}`}
									disabled={!canRoll}
									onClick={rollDice}
								>
									<span className='relative z-10 font-bold'>
										{isRolling ? '🎲 Rolling...' : '🎲 ROLL DICE'}
									</span>
									{!isRolling && (
										<span className='absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none'></span>
									)}
								</button>
							</div>
						</section>
					</div>

					{/* History Sidebar */}
					<aside className='lg:col-span-1'>
						<div className='sticky top-4'>
							<RollHistory history={rollHistory} onClear={clearHistory} />
						</div>
					</aside>
				</div>

				{/* Footer */}
				<footer className='text-center mt-8 sm:mt-4 pt-2 border-t border-slate-700'>
					<p className='max-w-xl mx-auto px-4 text-slate-400 text-sm mt-4'>
						🎲 Each roll brings new possibilities!
					</p>
				</footer>
			</div>
		</main>
	);
}

export default App;
