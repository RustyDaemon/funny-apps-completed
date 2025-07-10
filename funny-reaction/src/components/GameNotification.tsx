import { AnimatePresence, motion } from 'framer-motion';

export interface Verdict {
	text: string;
	emoji: string;
}

interface GameNotificationProps {
	showToast: string | null;
	toastType: 'error' | 'success' | 'info';
	reactionTime: number | null;
	verdict: Verdict | null;
}

const GameNotification = ({
	showToast,
	toastType,
	reactionTime,
	verdict,
}: GameNotificationProps) => {
	return (
		<AnimatePresence mode='wait'>
			{showToast ? (
				<motion.div
					key='notification'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: -20 }}
					className={`mt-8 text-center px-6 py-3 rounded-lg font-semibold ${
						toastType === 'error'
							? 'bg-red-500 text-white'
							: toastType === 'success'
							? 'bg-green-500 text-white'
							: 'bg-blue-500 text-white'
					}`}
				>
					{showToast}
				</motion.div>
			) : reactionTime !== null ? (
				<motion.div
					key='results'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					className='mt-8 text-center'
				>
					<div className='text-4xl font-bold text-lime-400 mb-2'>
						{reactionTime}ms
					</div>
					{verdict && (
						<div className='text-xl text-slate-300'>
							{verdict.text} {verdict.emoji}
						</div>
					)}
				</motion.div>
			) : null}
		</AnimatePresence>
	);
};

export default GameNotification;
