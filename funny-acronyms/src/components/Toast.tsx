import { AnimatePresence, motion } from 'framer-motion';

interface ToastProps {
	show: boolean;
	message: string;
}

export function Toast({ show, message }: ToastProps) {
	return (
		<AnimatePresence>
			{show && (
				<motion.div
					initial={{ y: 50, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					exit={{ y: -50, opacity: 0 }}
					transition={{
						type: 'spring',
						stiffness: 300,
						damping: 20,
						duration: 0.3,
					}}
					className='fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 z-50'
				>
					<span className='text-lg'>✅</span>
					<span className='font-medium'>{message}</span>
				</motion.div>
			)}
		</AnimatePresence>
	);
}
