import { AnimatePresence, motion } from 'framer-motion';
import { Download, Trash2, X } from 'lucide-react';
import React from 'react';
import type { DaydreamCard } from '../data/daydream';

interface GalleryProps {
	isOpen: boolean;
	onClose: () => void;
	savedCards: DaydreamCard[];
	onDeleteCard: (cardId: string) => void;
}

export function Gallery({
	isOpen,
	onClose,
	savedCards,
	onDeleteCard,
}: GalleryProps) {
	const downloadCardAsPNG = async (card: DaydreamCard) => {
		const canvas = document.createElement('canvas');
		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		// Set canvas size
		canvas.width = 520; // 2x for higher resolution
		canvas.height = 720;

		// Create gradient background - improved approach
		try {
			const gradient = ctx.createLinearGradient(
				0,
				0,
				canvas.width,
				canvas.height
			);

			// Extract hex colors only (most reliable)
			const hexMatches = card.background.match(/#[a-fA-F0-9]{6}/g);

			if (hexMatches && hexMatches.length >= 2) {
				gradient.addColorStop(0, hexMatches[0]);
				gradient.addColorStop(1, hexMatches[hexMatches.length - 1]);
			} else {
				// Parse the entire gradient string for common patterns
				const rgbMatches = card.background.match(
					/rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/g
				);

				if (rgbMatches && rgbMatches.length >= 2) {
					gradient.addColorStop(0, rgbMatches[0]);
					gradient.addColorStop(1, rgbMatches[rgbMatches.length - 1]);
				} else {
					// Extract percentage values and convert them to known colors
					const percentMatches = card.background.match(/(\d+)%/g);
					if (percentMatches) {
						// Use a predefined color palette based on the gradient
						const colorPalette = [
							['#667eea', '#764ba2'], // purple-blue
							['#f093fb', '#f5576c'], // pink-red
							['#4facfe', '#00f2fe'], // blue-cyan
							['#43e97b', '#38f9d7'], // green-teal
							['#fa709a', '#fee140'], // pink-yellow
						];
						const paletteIndex =
							Math.abs(card.background.length) % colorPalette.length;
						gradient.addColorStop(0, colorPalette[paletteIndex][0]);
						gradient.addColorStop(1, colorPalette[paletteIndex][1]);
					} else {
						// Final fallback
						gradient.addColorStop(0, '#667eea');
						gradient.addColorStop(1, '#764ba2');
					}
				}
			}

			ctx.fillStyle = gradient;
			ctx.fillRect(0, 0, canvas.width, canvas.height);

			// Set text properties
			ctx.fillStyle = 'white';
			ctx.textAlign = 'left';
			ctx.textBaseline = 'top';

			// Draw title
			ctx.font = 'bold 48px system-ui, Arial, sans-serif';
			ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
			ctx.shadowBlur = 4;
			ctx.shadowOffsetX = 2;
			ctx.shadowOffsetY = 2;

			const titleLines = wrapText(ctx, card.title, canvas.width - 96);
			titleLines.forEach((line, index) => {
				ctx.fillText(line, 48, 64 + index * 56);
			});

			// Draw poem lines
			ctx.font = 'italic 32px system-ui, Arial, sans-serif';
			ctx.shadowBlur = 2;
			ctx.shadowOffsetX = 1;
			ctx.shadowOffsetY = 1;

			const line1Wrapped = wrapText(ctx, card.line1, canvas.width - 96);
			const line2Wrapped = wrapText(ctx, card.line2, canvas.width - 96);

			const startY =
				canvas.height - 200 - (line1Wrapped.length + line2Wrapped.length) * 40;

			line1Wrapped.forEach((line, index) => {
				ctx.fillText(line, 48, startY + index * 40);
			});

			line2Wrapped.forEach((line, index) => {
				ctx.fillText(
					line,
					48,
					startY + (line1Wrapped.length + index) * 40 + 20
				);
			});

			// Download the image
			const link = document.createElement('a');
			// Clean the title for filename
			const cleanTitle = card.title
				.replace(/[^a-zA-Z0-9\s]/g, '')
				.replace(/\s+/g, '-')
				.toLowerCase();
			link.download = `daydream-${cleanTitle}.png`;
			link.href = canvas.toDataURL('image/png');
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		} catch (error) {
			console.error('Error generating PNG:', error);
		}
	};

	// Helper function to wrap text
	const wrapText = (
		ctx: CanvasRenderingContext2D,
		text: string,
		maxWidth: number
	): string[] => {
		const words = text.split(' ');
		const lines: string[] = [];
		let currentLine = '';

		for (const word of words) {
			const testLine = currentLine + (currentLine ? ' ' : '') + word;
			const metrics = ctx.measureText(testLine);

			if (metrics.width > maxWidth && currentLine) {
				lines.push(currentLine);
				currentLine = word;
			} else {
				currentLine = testLine;
			}
		}

		if (currentLine) {
			lines.push(currentLine);
		}

		return lines;
	};

	return (
		<AnimatePresence>
			{isOpen && (
				<>
					{/* Backdrop */}
					<motion.div
						className='fixed inset-0 bg-black/50 z-40'
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						onClick={onClose}
					/>

					{/* Gallery Panel */}
					<motion.div
						className='fixed right-0 top-0 h-full w-full sm:max-w-4xl bg-gray-900 z-50 overflow-y-auto'
						initial={{ x: '100%' }}
						animate={{ x: 0 }}
						exit={{ x: '100%' }}
						transition={{ type: 'spring', damping: 30, stiffness: 300 }}
					>
						{/* Header */}
						<div className='sticky top-0 bg-gray-900 border-b border-gray-700 p-4 sm:p-6 flex items-center justify-between z-10'>
							<h2 className='text-xl sm:text-2xl font-bold text-violet-300'>
								Gallery
							</h2>
							<button
								onClick={onClose}
								className='text-gray-400 hover:text-white transition-colors p-2'
								aria-label='Close gallery'
							>
								<X size={24} />
							</button>
						</div>

						{/* Content */}
						<div className='p-4 sm:p-6'>
							{savedCards.length === 0 ? (
								<div className='text-center text-gray-400 py-12'>
									<p className='text-lg mb-2'>No saved daydreams yet.</p>
									<p className='text-sm'>Click the ❤️ on cards to save them!</p>
								</div>
							) : (
								<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6'>
									{savedCards.map(card => (
										<motion.div
											key={card.id}
											className='relative group'
											initial={{ opacity: 0, y: 20 }}
											animate={{ opacity: 1, y: 0 }}
											transition={{ duration: 0.3 }}
										>
											<div
												className='w-full aspect-[3/4] rounded-2xl shadow-lg flex flex-col justify-between p-4 sm:p-6 relative overflow-hidden card-background'
												style={
													{
														'--card-background': card.background,
													} as React.CSSProperties & {
														'--card-background': string;
													}
												}
											>
												{/* Action buttons */}
												<div className='absolute top-2 right-2 flex gap-1 sm:gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity'>
													<button
														onClick={() => downloadCardAsPNG(card)}
														className='bg-black/30 hover:bg-black/50 text-white p-2 rounded-lg transition-colors backdrop-blur-sm'
														title='Download as PNG'
													>
														<Download size={16} />
													</button>
													<button
														onClick={() => onDeleteCard(card.id)}
														className='bg-black/30 hover:bg-red-500/50 text-white p-2 rounded-lg transition-colors backdrop-blur-sm'
														title='Delete'
													>
														<Trash2 size={16} />
													</button>
												</div>

												{/* Title */}
												<div className='flex-1 flex items-start pt-2'>
													<h3 className='text-lg sm:text-xl font-bold text-white drop-shadow-lg leading-tight'>
														{card.title}
													</h3>
												</div>

												{/* Poem */}
												<div className='space-y-2'>
													<p className='text-sm sm:text-base italic text-white/95 leading-snug drop-shadow'>
														{card.line1}
													</p>
													<p className='text-sm sm:text-base italic text-white/95 leading-snug drop-shadow'>
														{card.line2}
													</p>
												</div>
											</div>
										</motion.div>
									))}
								</div>
							)}
						</div>
					</motion.div>
				</>
			)}
		</AnimatePresence>
	);
}
