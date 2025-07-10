import { AnimatePresence, motion } from 'framer-motion';
import { FiThumbsUp } from 'react-icons/fi';

interface ResultProps {
	text: string;
	emoji: string;
	onReset: () => void;
}

const Result = ({ text, emoji, onReset }: ResultProps) => {
	return (
		<AnimatePresence>
			<div className='card max-w-md w-full mx-auto text-center'>
				<div className='text-6xl mb-4'>{emoji}</div>

				<h2 className='text-2xl font-bold mb-6 text-[rgb(var(--primary))]'>
					{text}
				</h2>

				<motion.button
					className='btn btn-secondary flex items-center justify-center mx-auto'
					whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.95 }}
					onClick={onReset}
				>
					<FiThumbsUp className='mr-2' />
					Dream Again
				</motion.button>
			</div>
		</AnimatePresence>
	);
};

export default Result;
