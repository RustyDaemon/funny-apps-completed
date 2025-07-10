import { motion } from 'framer-motion';
import { FaStar } from 'react-icons/fa';

interface StarRatingProps {
	value: number;
	onChange: (rating: number) => void;
}

const StarRating = ({ value, onChange }: StarRatingProps) => {
	return (
		<div className='flex items-center justify-center space-x-2 my-4'>
			{[1, 2, 3].map(star => (
				<motion.button
					key={star}
					type='button'
					onClick={() => onChange(star)}
					whileHover={{ scale: 1.2 }}
					whileTap={{ scale: 0.9 }}
					className='focus:outline-none'
				>
					<FaStar
						size={32}
						className={`${
							star <= value
								? 'text-[rgb(var(--secondary))]'
								: 'text-gray-300 dark:text-gray-600'
						} 
              transition-colors duration-200`}
					/>
				</motion.button>
			))}
		</div>
	);
};

export default StarRating;
