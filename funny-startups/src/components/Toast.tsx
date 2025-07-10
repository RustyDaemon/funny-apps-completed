import { AnimatePresence, motion } from 'framer-motion';

interface ToastProps {
	isVisible: boolean;
	message: string;
}

export default function Toast({ isVisible, message }: ToastProps) {
	return (
		<AnimatePresence>
			{isVisible && (
				<motion.div
					initial={{ opacity: 0, y: 50, scale: 0.8 }}
					animate={{ opacity: 1, y: 0, scale: 1 }}
					exit={{ opacity: 0, y: -50, scale: 0.8 }}
					transition={{
						type: 'spring',
						stiffness: 200,
						damping: 20,
					}}
					className='fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50'
				>
					<div className='bg-green-500 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3'>
						<span className='text-xl'>✅</span>
						<span className='font-semibold'>{message}</span>
					</div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}
