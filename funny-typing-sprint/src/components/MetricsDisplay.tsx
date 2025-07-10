import type { GameMetrics } from '../types/game';

interface MetricsDisplayProps {
	metrics: GameMetrics;
	timeLeft: number;
	duration: number;
}

export function MetricsDisplay({
	metrics,
	timeLeft,
	duration,
}: MetricsDisplayProps) {
	const progress = (timeLeft / duration) * 100;
	const isLowTime = timeLeft <= 10;

	return (
		<div className='space-y-4'>
			{/* Timer Progress Bar */}
			<div className='bg-gray-800 rounded-lg p-4'>
				<div className='flex items-center justify-between mb-2'>
					<div className='text-sm text-gray-400'>Time Remaining</div>
					<div
						className={`text-xl font-bold ${
							isLowTime ? 'text-red-400 animate-pulse' : 'text-blue-400'
						}`}
					>
						{timeLeft}s
					</div>
				</div>
				<div className='w-full bg-gray-700 rounded-full h-2'>
					<div
						className={`h-2 rounded-full transition-all duration-1000 ${
							isLowTime ? 'bg-red-500' : 'bg-blue-500'
						}`}
						style={{ width: `${progress}%` } as React.CSSProperties}
					/>
				</div>
			</div>

			{/* Metrics Grid */}
			<div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
				<div className='bg-gray-800/50 rounded-lg p-3 text-center'>
					<div className='text-2xl font-bold text-green-400'>
						{metrics.accuracy.toFixed(1)}%
					</div>
					<div className='text-sm text-gray-400'>Accuracy</div>
				</div>

				<div className='bg-gray-800/50 rounded-lg p-3 text-center'>
					<div className='text-2xl font-bold text-yellow-400'>
						{metrics.wpm.toFixed(0)}
					</div>
					<div className='text-sm text-gray-400'>WPM</div>
				</div>

				<div className='bg-gray-800/50 rounded-lg p-3 text-center'>
					<div className='text-2xl font-bold text-purple-400'>
						{metrics.spm.toFixed(0)}
					</div>
					<div className='text-sm text-gray-400'>SPM</div>
				</div>

				<div className='bg-gray-800/50 rounded-lg p-3 text-center'>
					<div className='text-2xl font-bold text-red-400'>
						{metrics.errors}
					</div>
					<div className='text-sm text-gray-400'>Errors</div>
				</div>
			</div>
		</div>
	);
}
