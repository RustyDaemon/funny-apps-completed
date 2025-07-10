import { motion } from 'framer-motion';
import React from 'react';
import { useTheme } from '../../hooks/useTheme';

/**
 * Theme toggle button component with smooth animations
 */
export const ThemeToggle: React.FC = () => {
	const { theme, toggleTheme } = useTheme();

	return (
		<motion.button
			onClick={toggleTheme}
			className={`
        relative w-14 h-7 rounded-full p-1 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 
        ${
					theme === 'dark'
						? 'bg-blue-600 focus:ring-offset-gray-800'
						: 'bg-gray-300 focus:ring-offset-white'
				}
      `}
			whileTap={{ scale: 0.95 }}
			whileHover={{ scale: 1.05 }}
			aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
		>
			<motion.div
				className={`
          w-5 h-5 rounded-full shadow-md flex items-center justify-center text-xs
          ${
						theme === 'dark'
							? 'bg-blue-900 text-yellow-300'
							: 'bg-white text-gray-600'
					}
        `}
				animate={{
					x: theme === 'dark' ? 24 : 0,
				}}
				transition={{
					type: 'spring',
					stiffness: 500,
					damping: 30,
				}}
			>
				<motion.span
					key={theme}
					initial={{ rotate: -180, opacity: 0 }}
					animate={{ rotate: 0, opacity: 1 }}
					exit={{ rotate: 180, opacity: 0 }}
					transition={{ duration: 0.3 }}
				>
					{theme === 'dark' ? '🌙' : '☀️'}
				</motion.span>
			</motion.div>
		</motion.button>
	);
};
