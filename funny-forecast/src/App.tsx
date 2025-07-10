import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useState } from 'react';
import {
	afternoons,
	evenings,
	mornings,
	type ForecastItem,
} from './data/forecast';

interface ForecastState {
	morning: ForecastItem;
	afternoon: ForecastItem;
	evening: ForecastItem;
}

function getRandomItem<T>(array: T[]): T {
	return array[Math.floor(Math.random() * array.length)]!;
}

function generateForecast(): ForecastState {
	return {
		morning: getRandomItem(mornings),
		afternoon: getRandomItem(afternoons),
		evening: getRandomItem(evenings),
	};
}

type TimeOfDay = keyof ForecastState;

interface ForecastCardProps {
	timeOfDay: TimeOfDay;
	item: ForecastItem;
	onRefresh: (timeOfDay: TimeOfDay) => void;
	index: number;
}

function ForecastCard({
	timeOfDay,
	item,
	onRefresh,
	index,
}: ForecastCardProps) {
	const [isExiting, setIsExiting] = useState(false);

	const handleRefresh = useCallback(() => {
		setIsExiting(true);
	}, []);

	return (
		<div className='relative'>
			<AnimatePresence
				mode='wait'
				onExitComplete={() => {
					if (isExiting) {
						onRefresh(timeOfDay);
						setIsExiting(false);
					}
				}}
			>
				<motion.div
					key={`${timeOfDay}-${item.text}`}
					className='bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl px-6 py-8 w-[90%] max-w-md mx-auto border border-emerald-400/20 relative overflow-hidden cursor-pointer select-none'
					initial={{ y: 40, opacity: 0, rotateX: -15 }}
					animate={{ y: 0, opacity: 1, rotateX: 0 }}
					transition={{
						type: 'spring',
						delay: index * 0.1,
					}}
					onClick={handleRefresh}
					whileHover={{ scale: 1.02 }}
				>
					{/* Time period label */}
					<div className='text-emerald-400 text-sm font-semibold uppercase tracking-wide mb-3'>
						{timeOfDay}
					</div>

					{/* Weather icon */}
					<div className='text-5xl mb-4 text-center'>{item.icon}</div>

					{/* Temperature */}
					<div className='text-3xl font-bold text-emerald-300 text-center mb-3'>
						{item.temp}
					</div>

					{/* Description */}
					<div className='text-center text-gray-300 text-lg leading-relaxed'>
						{item.text}
					</div>

					{/* Decorative gradient overlay */}
					<div className='absolute inset-0 bg-gradient-to-t from-emerald-500/15 to-transparent pointer-events-none' />
				</motion.div>
			</AnimatePresence>
		</div>
	);
}

function App() {
	const [forecast, setForecast] = useState<ForecastState>(generateForecast);
	const [refreshKey, setRefreshKey] = useState(0);

	const refreshSingleCard = useCallback((timeOfDay: TimeOfDay) => {
		setForecast((prev: ForecastState) => {
			const newItem =
				timeOfDay === 'morning'
					? getRandomItem(mornings)
					: timeOfDay === 'afternoon'
					? getRandomItem(afternoons)
					: getRandomItem(evenings);

			return {
				...prev,
				[timeOfDay]: newItem,
			};
		});
	}, []);

	const refreshAllCards = useCallback(() => {
		setForecast(generateForecast());
		setRefreshKey((prev: number) => prev + 1);
	}, []);

	return (
		<div className='min-h-screen bg-gray-950 text-emerald-300'>
			{/* Header */}
			<header className='px-4 py-6 flex items-center justify-between'>
				<motion.h1
					className='text-2xl md:text-3xl font-bold bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent'
					key={refreshKey}
					animate={{
						scale: refreshKey > 0 ? [1, 1.05, 1] : 1,
					}}
					transition={{ duration: 0.3 }}
				>
					Funny Day Forecast
				</motion.h1>

				<div className='flex items-center gap-4'>
					<div className='text-sm text-emerald-400/80 hidden sm:block'>
						{new Date()
							.toLocaleDateString('en-GB', {
								day: '2-digit',
								month: 'short',
								year: 'numeric',
							})
							.replace(/ /g, ' ')}
					</div>
					<motion.button
						className='bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-200 shadow-lg'
						onClick={refreshAllCards}
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
					>
						REFRESH ALL
					</motion.button>
				</div>
			</header>

			{/* Main content */}
			<main className='px-4 pb-8'>
				<motion.div
					className='grid gap-6 md:grid-cols-3 md:gap-8 max-w-6xl mx-auto'
					key={refreshKey}
					animate={
						refreshKey > 0
							? {
									rotateZ: [-1, 1, 0],
							  }
							: {}
					}
					transition={{ duration: 0.2 }}
				>
					<ForecastCard
						timeOfDay='morning'
						item={forecast.morning}
						onRefresh={refreshSingleCard}
						index={0}
					/>
					<ForecastCard
						timeOfDay='afternoon'
						item={forecast.afternoon}
						onRefresh={refreshSingleCard}
						index={1}
					/>
					<ForecastCard
						timeOfDay='evening'
						item={forecast.evening}
						onRefresh={refreshSingleCard}
						index={2}
					/>
				</motion.div>
			</main>
		</div>
	);
}

export default App;
