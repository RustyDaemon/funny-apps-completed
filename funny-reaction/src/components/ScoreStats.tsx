import { motion } from 'framer-motion';

interface ScoreStatsProps {
	bestTime: number | null;
	worstTime: number | null;
	isNewBest: boolean;
}

const ScoreStats = ({ bestTime, worstTime, isNewBest }: ScoreStatsProps) => {
	return (
		<div className='mt-8 flex gap-8 text-center'>
			<div>
				<div className='text-sm text-slate-400 mb-1'>Best</div>
				<motion.div
					className='text-lg font-bold text-green-400'
					animate={
						isNewBest
							? {
									scale: [1, 1.25, 1],
							  }
							: {}
					}
					transition={{ duration: 0.5 }}
				>
					{bestTime ? `${bestTime}ms` : '—'}
				</motion.div>
			</div>
			<div>
				<div className='text-sm text-slate-400 mb-1'>Worst</div>
				<div className='text-lg font-bold text-red-400'>
					{worstTime ? `${worstTime}ms` : '—'}
				</div>
			</div>
		</div>
	);
};

export default ScoreStats;
