import { motion } from 'framer-motion';
import type { TimeDuration } from '../types/game';

interface DifficultyButtonProps {
	duration: TimeDuration;
	isSelected: boolean;
	onClick: (duration: TimeDuration) => void;
	disabled: boolean;
}

function DifficultyButton({
	duration,
	isSelected,
	onClick,
	disabled,
}: DifficultyButtonProps) {
	return (
		<motion.button
			whileHover={{ scale: disabled ? 1 : 1.05 }}
			whileTap={{ scale: disabled ? 1 : 0.95 }}
			onClick={() => !disabled && onClick(duration)}
			disabled={disabled}
			className={`
        px-6 py-3 rounded-lg font-semibold transition-all duration-200
        ${
					isSelected
						? 'bg-blue-600 text-white shadow-lg'
						: 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
				}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-black
      `}
			aria-pressed={isSelected}
		>
			{duration}s
		</motion.button>
	);
}

interface DifficultySelectProps {
	selectedDuration: TimeDuration;
	onDurationChange: (duration: TimeDuration) => void;
	disabled: boolean;
}

export function DifficultySelect({
	selectedDuration,
	onDurationChange,
	disabled,
}: DifficultySelectProps) {
	const durations: TimeDuration[] = [5, 10, 15, 30, 60];

	return (
		<div className='flex flex-col items-center space-y-4'>
			<h2 className='text-xl font-semibold text-gray-200 no-select'>
				Time Limit
			</h2>
			<div className='flex flex-wrap gap-3 justify-center'>
				{durations.map(duration => (
					<DifficultyButton
						key={duration}
						duration={duration}
						isSelected={selectedDuration === duration}
						onClick={onDurationChange}
						disabled={disabled}
					/>
				))}
			</div>
		</div>
	);
}
