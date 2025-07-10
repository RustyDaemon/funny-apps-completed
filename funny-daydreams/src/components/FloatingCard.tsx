import { motion } from 'framer-motion';
import { Heart, X } from 'lucide-react';
import type { DaydreamCard } from '../data/daydream';

interface FloatingCardProps {
	card: DaydreamCard | null;
	onSave: (card: DaydreamCard) => void;
	onUnsave: (cardId: string) => void;
	isSaved: boolean;
	onClose: () => void;
}

export function FloatingCard({
	card,
	onSave,
	onUnsave,
	isSaved,
	onClose,
}: FloatingCardProps) {
	if (!card) return null;

	const handleHeartClick = (e: React.MouseEvent) => {
		e.stopPropagation();
		if (isSaved) {
			onUnsave(card.id);
		} else {
			onSave(card);
		}
	};

	const handleCardClick = (e: React.MouseEvent) => {
		e.stopPropagation();
	};

	const handleCloseClick = (e: React.MouseEvent) => {
		e.stopPropagation();
		onClose();
	};

	return (
		<>
			{/* Backdrop */}
			<motion.div
				className='fixed inset-0 bg-black/60 z-50 backdrop-blur-sm'
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
				onClick={onClose}
			/>

			{/* Card */}
			<motion.div
				className='fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2'
				initial={{ scale: 0.8, opacity: 0 }}
				animate={{ scale: 1, opacity: 1 }}
				exit={{ scale: 0.8, opacity: 0 }}
				transition={{ duration: 0.3 }}
				onClick={handleCardClick}
			>
				<div
					className='w-[360px] h-[450px] sm:w-[380px] sm:h-[400px] rounded-3xl shadow-2xl flex flex-col justify-between p-6 relative overflow-hidden card-background'
					style={
						{ '--card-background': card.background } as React.CSSProperties & {
							'--card-background': string;
						}
					}
				>
					{/* Close button */}
					<motion.button
						className='absolute top-3 right-3 z-20 text-white/70 hover:text-white transition-colors bg-black/20 rounded-full p-1.5'
						onClick={handleCloseClick}
						whileHover={{ scale: 1.1 }}
						whileTap={{ scale: 0.95 }}
					>
						<X size={18} />
					</motion.button>

					{/* Heart save button */}
					<motion.button
						className='absolute top-3 left-3 z-20 text-white/80 hover:text-white transition-colors bg-black/20 rounded-full p-1.5'
						onClick={handleHeartClick}
						whileHover={{ scale: 1.1 }}
						whileTap={{ scale: [1, 1.3, 1] }}
						transition={{ duration: 0.2 }}
					>
						<Heart
							size={20}
							fill={isSaved ? 'currentColor' : 'none'}
							className='drop-shadow-lg'
						/>
					</motion.button>

					{/* Title */}
					<div className='flex-1 flex items-start pt-12'>
						<h2 className='text-3xl sm:text-4xl font-bold text-white drop-shadow-lg leading-tight'>
							{card.title}
						</h2>
					</div>

					{/* Poem */}
					<div className='space-y-3'>
						<p className='text-lg sm:text-xl italic text-white/95 leading-snug drop-shadow'>
							{card.line1}
						</p>
						<p className='text-lg sm:text-xl italic text-white/95 leading-snug drop-shadow'>
							{card.line2}
						</p>
					</div>
				</div>
			</motion.div>
		</>
	);
}
