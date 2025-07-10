import { motion } from 'framer-motion';
import { FiMoon, FiSun } from 'react-icons/fi';
import { useTheme } from '../contexts/ThemeContext';

const ThemeSwitcher = () => {
	const { theme, toggleTheme } = useTheme();

	return (
		<motion.button
			onClick={toggleTheme}
			className='fixed top-4 right-4 p-2 rounded-full bg-[rgb(var(--muted))] text-[rgb(var(--foreground))]'
			whileTap={{ scale: 0.9 }}
			whileHover={{ scale: 1.1 }}
			aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
		>
			{theme === 'light' ? <FiMoon size={20} /> : <FiSun size={20} />}
		</motion.button>
	);
};

export default ThemeSwitcher;
