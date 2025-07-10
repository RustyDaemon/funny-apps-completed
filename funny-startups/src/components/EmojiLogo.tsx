import { motion } from 'framer-motion';

interface EmojiLogoProps {
	emoji: string;
}

export default function EmojiLogo({ emoji }: EmojiLogoProps) {
	return (
		<div className='relative flex justify-center mb-8'>
			<motion.div
				key={emoji}
				initial={{ scale: 0 }}
				animate={{
					scale: 1,
				}}
				className='text-6xl xl:text-8xl bg-gradient-to-r from-pink-500 to-fuchsia-600 p-4 rounded-full shadow-2xl'
				style={{
					background: 'linear-gradient(135deg, #ec4899, #c844b6)',
					boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)',
				}}
			>
				<span className=''>{emoji}</span>
			</motion.div>
		</div>
	);
}
