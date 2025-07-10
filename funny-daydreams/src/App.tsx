import { AnimatePresence, motion } from 'framer-motion';
import { Image } from 'lucide-react';
import { useEffect, useState } from 'react';
import { FloatingCard } from './components/FloatingCard';
import { Gallery } from './components/Gallery';
import { createCard, type DaydreamCard } from './data/daydream';

const STORAGE_KEY = 'daydream-gallery';

function App() {
	const [currentCard, setCurrentCard] = useState<DaydreamCard | null>(null);
	const [savedCards, setSavedCards] = useState<DaydreamCard[]>([]);
	const [isGalleryOpen, setIsGalleryOpen] = useState(false);
	const [lastCard, setLastCard] = useState<DaydreamCard | undefined>();

	// Load saved cards from localStorage on mount
	useEffect(() => {
		const saved = localStorage.getItem(STORAGE_KEY);
		if (saved) {
			try {
				setSavedCards(JSON.parse(saved));
			} catch (error) {
				console.error('Failed to load saved cards:', error);
			}
		}
	}, []);

	// Save cards to localStorage whenever savedCards changes
	useEffect(() => {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(savedCards));
	}, [savedCards]);

	const generateCard = () => {
		const newCard = createCard(lastCard);
		setLastCard(newCard);
		setCurrentCard(newCard);
	};

	const closeCard = () => {
		setCurrentCard(null);
	};

	const saveCard = (card: DaydreamCard) => {
		setSavedCards(prev => {
			if (prev.some(saved => saved.id === card.id)) {
				return prev; // Already saved
			}
			return [...prev, card];
		});
	};

	const unsaveCard = (cardId: string) => {
		setSavedCards(prev => prev.filter(card => card.id !== cardId));
	};

	const deleteCard = (cardId: string) => {
		setSavedCards(prev => prev.filter(card => card.id !== cardId));
	};

	const isCardSaved = (cardId: string) => {
		return savedCards.some(card => card.id === cardId);
	};

	return (
		<div className='min-h-screen bg-gray-950 text-violet-300 relative overflow-hidden dark'>
			{/* Background elements */}
			<div className='absolute inset-0 bg-gradient-to-br from-gray-950 via-purple-950/20 to-gray-950 pointer-events-none' />

			{/* Floating particles */}
			<div className='absolute inset-0 overflow-hidden pointer-events-none'>
				{[...Array(20)].map((_, i) => {
					// Generate consistent random positions based on index
					const leftPos = (i * 5.26) % 100; // Creates distributed positions
					const topPos = (i * 7.89) % 100;

					return (
						<motion.div
							key={`particle-${i}`}
							className='absolute w-1 h-1 bg-violet-400/30 rounded-full'
							style={{
								left: `${leftPos}%`,
								top: `${topPos}%`,
							}}
							animate={{
								y: [0, -20, 0],
								opacity: [0.3, 0.8, 0.3],
							}}
							transition={{
								duration: 3 + (i % 3),
								repeat: Infinity,
								delay: i * 0.1,
							}}
						/>
					);
				})}
			</div>

			{/* Main content */}
			<div className='relative z-10 flex flex-col items-center justify-center min-h-screen p-4 sm:p-6'>
				{/* Header */}
				<motion.div
					className='text-center mb-8 sm:mb-12 max-w-4xl mx-auto'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
				>
					<h1 className='text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent mb-4 sm:mb-6'>
						Funny Daydreams
					</h1>
					<p className='text-lg sm:text-xl text-violet-300/80 max-w-2xl mx-auto leading-relaxed text-center'>
						Conjure whimsical postcards that capture the magic of your
						imagination
					</p>
				</motion.div>

				{/* Main controls */}
				<motion.div
					className='flex flex-col sm:flex-row items-center gap-4 sm:gap-6 mb-8 sm:mb-12'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, delay: 0.2 }}
				>
					<motion.button
						onClick={generateCard}
						disabled={!!currentCard}
						className='relative px-8 sm:px-12 py-4 sm:py-6 text-xl sm:text-2xl font-bold text-white rounded-2xl bg-gradient-to-r from-pink-500 to-fuchsia-600 shadow-2xl transition-all duration-300 hover:shadow-pink-500/25 hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3'
						whileHover={{ scale: currentCard ? 1 : 1.05 }}
						whileTap={{ scale: currentCard ? 1 : 0.95 }}
					>
						<span className='relative z-10'>IMAGINE</span>
						<div className='absolute inset-0 rounded-2xl bg-gradient-to-r from-pink-600 to-fuchsia-700 opacity-0 hover:opacity-100 transition-opacity duration-300' />
					</motion.button>

					<motion.button
						onClick={() => setIsGalleryOpen(true)}
						className='flex items-center gap-2 px-4 sm:px-6 py-3 text-base sm:text-lg font-semibold text-violet-300 border-2 border-violet-500/30 rounded-xl hover:border-violet-400 hover:bg-violet-500/10 transition-all duration-300'
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
					>
						<Image size={20} />
						Gallery ({savedCards.length})
					</motion.button>
				</motion.div>
			</div>

			{/* Current card modal */}
			<AnimatePresence>
				{currentCard && (
					<FloatingCard
						card={currentCard}
						onSave={saveCard}
						onUnsave={unsaveCard}
						isSaved={isCardSaved(currentCard.id)}
						onClose={closeCard}
					/>
				)}
			</AnimatePresence>

			{/* Gallery */}
			<Gallery
				isOpen={isGalleryOpen}
				onClose={() => setIsGalleryOpen(false)}
				savedCards={savedCards}
				onDeleteCard={deleteCard}
			/>
		</div>
	);
}

export default App;
