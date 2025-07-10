import React, { useEffect, useState } from 'react';
import { CommandContext } from '../types';

export const zombieApocalypse = async (
	context: CommandContext
): Promise<void> => {
	const { addOutput, setIsRunning, abortSignal } = context;

	setIsRunning(true);

	const ZombieGame: React.FC = () => {
		const [day, setDay] = useState(1);
		const [survivors, setSurvivors] = useState(100);
		const [zombies, setZombies] = useState(10);
		const [supplies, setSupplies] = useState(50);
		const [events, setEvents] = useState<string[]>([]);

		useEffect(() => {
			const simulate = setInterval(() => {
				if (abortSignal.aborted) {
					setIsRunning(false);
					return;
				}

				setDay(prev => prev + 1);

				// Random events
				const eventChance = Math.random();
				let newEvent = '';

				if (eventChance < 0.2) {
					// Zombie attack
					const casualties = Math.floor(Math.random() * 10 + 1);
					setSurvivors(prev => Math.max(0, prev - casualties));
					setZombies(prev => prev + casualties);
					newEvent = `🧟 Zombie attack! Lost ${casualties} survivors.`;
				} else if (eventChance < 0.4) {
					// Found supplies
					const foundSupplies = Math.floor(Math.random() * 15 + 5);
					setSupplies(prev => prev + foundSupplies);
					newEvent = `📦 Found supplies! +${foundSupplies} resources.`;
				} else if (eventChance < 0.5) {
					// Survivors found
					const newSurvivors = Math.floor(Math.random() * 5 + 1);
					setSurvivors(prev => prev + newSurvivors);
					newEvent = `🏃 New survivors joined! +${newSurvivors} people.`;
				} else {
					// Quiet day
					newEvent = '🌅 Quiet day. Everyone rests and recovers.';
				}

				// Supply consumption
				setSurvivors(prev => {
					const currentSurvivors = prev;
					setSupplies(prevSupplies => {
						const consumption = Math.floor(currentSurvivors / 5);
						return Math.max(0, prevSupplies - consumption);
					});
					return currentSurvivors;
				});

				// Starvation
				setSupplies(prevSupplies => {
					if (prevSupplies <= 0) {
						setSurvivors(prev => Math.max(0, prev - 5));
						newEvent += ' 💀 Starvation claims lives!';
					}
					return prevSupplies;
				});

				setEvents(prev => [newEvent, ...prev.slice(0, 4)]);

				// Check win/lose conditions
				setSurvivors(currentSurvivors => {
					if (currentSurvivors <= 0) {
						setIsRunning(false);
					}
					return currentSurvivors;
				});
			}, 2000);

			return () => clearInterval(simulate);
		}, []);

		if (survivors <= 0) {
			return (
				<div className='my-2'>
					<div className='text-red-500 text-center text-xl mb-2'>
						💀 GAME OVER 💀
					</div>
					<div className='text-gray-400 text-center'>
						Humanity lasted {day} days during the zombie apocalypse.
					</div>
					<div className='text-yellow-400 text-center mt-2'>
						Better luck next time, survivor...
					</div>
				</div>
			);
		}

		return (
			<div className='my-2'>
				<div className='text-red-500 mb-2 text-center'>
					🧟 ZOMBIE APOCALYPSE SIMULATOR 🧟
				</div>
				<div className='bg-gray-900 p-3 rounded border'>
					<div className='grid grid-cols-2 gap-4 mb-3 text-sm'>
						<div>
							<div className='text-blue-400'>📅 Day: {day}</div>
							<div className='text-green-400'>👥 Survivors: {survivors}</div>
						</div>
						<div>
							<div className='text-red-400'>🧟 Zombies: {zombies}</div>
							<div className='text-yellow-400'>📦 Supplies: {supplies}</div>
						</div>
					</div>

					<div className='border-t border-gray-700 pt-2'>
						<div className='text-cyan-400 text-sm mb-1'>Recent Events:</div>
						{events.map((event, index) => (
							<div key={index} className='text-gray-300 text-xs mb-1'>
								{event}
							</div>
						))}
					</div>
				</div>
				<div className='text-gray-500 text-xs mt-2'>
					Press Ctrl+C to abandon the survivors and escape...
				</div>
			</div>
		);
	};

	addOutput(<ZombieGame />);

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
