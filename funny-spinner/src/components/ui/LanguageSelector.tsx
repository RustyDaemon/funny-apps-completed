import { motion } from 'framer-motion';
import React from 'react';
import type { SupportedLanguage } from '../../contexts/LanguageContext';
import { useLanguage } from '../../hooks/useLanguage';
import { useTheme } from '../../hooks/useTheme';

// Language flags
const languages: Record<SupportedLanguage, { flag: string; name: string }> = {
	en: { flag: '🇺🇸', name: 'English' },
	uk: { flag: '🇺🇦', name: 'Українська' },
	pl: { flag: '🇵🇱', name: 'Polski' },
};

// Order of language cycling
const languageOrder: SupportedLanguage[] = ['en', 'uk', 'pl'];

export const LanguageSelector: React.FC = () => {
	const { language, setLanguage } = useLanguage();
	const { theme } = useTheme();

	const currentLanguage = languages[language];

	const handleLanguageToggle = () => {
		const currentIndex = languageOrder.indexOf(language);
		const nextIndex = (currentIndex + 1) % languageOrder.length;
		setLanguage(languageOrder[nextIndex]);
	};

	return (
		<motion.button
			onClick={handleLanguageToggle}
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
			aria-label={`Current language: ${currentLanguage.name}. Click to change language.`}
			title={`Current: ${currentLanguage.name}`}
		>
			<motion.div
				className={`
					w-5 h-5 rounded-full shadow-md flex items-center justify-center text-xs
					${theme === 'dark' ? 'bg-blue-900' : 'bg-white'}
				`}
				animate={{
					x: language === 'en' ? 0 : language === 'uk' ? 12 : 24,
				}}
				transition={{
					type: 'spring',
					stiffness: 500,
					damping: 30,
				}}
			>
				<motion.span
					key={language}
					initial={{ rotate: -180, opacity: 0 }}
					animate={{ rotate: 0, opacity: 1 }}
					exit={{ rotate: 180, opacity: 0 }}
					transition={{ duration: 0.3 }}
					className='text-[10px]'
				>
					{currentLanguage.flag}
				</motion.span>
			</motion.div>
		</motion.button>
	);
};
