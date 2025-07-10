import { AnimatePresence, motion } from 'framer-motion';

type PopupProps = {
	isOpen: boolean;
	onClose?: () => void;
	onConfirm?: () => void;
	title: string;
	children: React.ReactNode;
	confirmText?: string;
	cancelText?: string;
	showCancel?: boolean;
	variant?: 'info' | 'warning' | 'success';
};

const Popup: React.FC<PopupProps> = ({
	isOpen,
	onClose,
	onConfirm,
	title,
	children,
	confirmText = 'Confirm',
	cancelText = 'Cancel',
	showCancel = true,
	variant = 'info',
}) => {
	// Determine the background gradient based on variant
	const bgGradient =
		variant === 'warning'
			? 'from-red-400 to-orange-600'
			: variant === 'success'
			? 'from-green-400 to-emerald-600'
			: 'from-blue-400 to-indigo-600'; // info default

	// Determine the confirm button style based on variant
	const confirmBtnStyle =
		variant === 'warning'
			? 'bg-red-400 hover:bg-red-300 text-white'
			: variant === 'success'
			? 'bg-green-400 hover:bg-green-300 text-green-800'
			: 'bg-blue-400 hover:bg-blue-300 text-blue-800';

	// Determine the border color based on variant
	const borderColor =
		variant === 'warning'
			? 'border-red-300'
			: variant === 'success'
			? 'border-green-300'
			: 'border-blue-300';

	return (
		<AnimatePresence>
			{isOpen && (
				<>
					{/* Backdrop */}
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className='fixed inset-0 bg-black/50 z-40 backdrop-blur-sm'
						onClick={onClose}
					/>

					{/* Popup */}
					<motion.div
						initial={{ opacity: 0, y: -50, scale: 0.5 }}
						animate={{ opacity: 1, y: 0, scale: 1 }}
						exit={{ opacity: 0, y: 50, scale: 0.5 }}
						transition={{ type: 'spring', stiffness: 300, damping: 15 }}
						className={`fixed top-1/3 left-0 right-0 mx-auto w-72 sm:w-80 md:w-96 
                        bg-gradient-to-r ${bgGradient} text-white p-4 sm:p-6 rounded-xl 
                        text-center shadow-xl border-4 ${borderColor} z-50 max-w-[90vw]`}
					>
						<h2 className='text-2xl sm:text-3xl font-bold mb-3'>{title}</h2>

						<div className='my-4'>{children}</div>

						<div className='flex gap-3 mt-4'>
							{showCancel && (
								<button
									onClick={onClose}
									className='flex-1 bg-white/20 hover:bg-white/30 
                             py-2 px-4 rounded-full transition-colors'
								>
									{cancelText}
								</button>
							)}

							<button
								onClick={onConfirm}
								className={`flex-1 ${confirmBtnStyle} 
                           font-bold py-2 px-4 rounded-full transition-colors
                           shadow-md hover:shadow-lg`}
							>
								{confirmText}
							</button>
						</div>
					</motion.div>
				</>
			)}
		</AnimatePresence>
	);
};

export default Popup;
