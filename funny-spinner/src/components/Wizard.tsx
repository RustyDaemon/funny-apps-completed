import { motion } from 'framer-motion';
import React, { useState } from 'react';
import { ANIMATION_CONFIG, SPINNER_CONFIG, THEME_STYLES } from '../constants';
import { PRESETS } from '../data/presets';
import { useLanguage } from '../hooks/useLanguage';
import { useTheme } from '../hooks/useTheme';
import type { GameData, Preset } from '../types';
import { createSpinnerItems, validateInput } from '../utils/spinner';
import { LanguageSelector } from './ui/LanguageSelector';
import { ThemeToggle } from './ui/ThemeToggle';

interface WizardProps {
	onComplete: (data: GameData) => void;
}

/**
 * Wizard component - handles initial setup and configuration
 */
export const Wizard: React.FC<WizardProps> = ({ onComplete }) => {
	const [question, setQuestion] = useState('');
	const [items, setItems] = useState<string[]>(['', '']);
	const [error, setError] = useState<string | null>(null);
	const { theme } = useTheme();
	const { t } = useLanguage();

	// Get translated presets

	const addItem = () => {
		if (items.length < SPINNER_CONFIG.MAX_ITEMS) {
			setItems([...items, '']);
		}
	};

	const removeItem = (index: number) => {
		if (items.length > SPINNER_CONFIG.MIN_ITEMS) {
			setItems(items.filter((_, i) => i !== index));
		}
	};

	const updateItem = (index: number, value: string) => {
		const newItems = [...items];
		newItems[index] = value;
		setItems(newItems);
	};

	const handlePresetClick = (preset: Preset) => {
		setQuestion(preset.question);
		setItems(preset.answers);
		setError(null);
	};

	const handleReset = () => {
		setQuestion('');
		setItems(['', '']);
		setError(null);
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		const validationError = validateInput(question, items, t);
		if (validationError) {
			setError(validationError);
			return;
		}

		const spinnerItems = createSpinnerItems(items);
		onComplete({
			question: question.trim(),
			items: spinnerItems,
		});
	};

	return (
		<div
			className={`min-h-screen ${THEME_STYLES.backgrounds[theme]} p-4 transition-colors duration-300`}
		>
			<div className='max-w-6xl mx-auto'>
				{/* Header */}
				<motion.div
					className='text-center mb-8 pt-4 relative'
					initial={{ y: -50, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					transition={ANIMATION_CONFIG.spring}
				>
					{/* Theme toggle and Language selector in top right */}
					<div className='absolute top-0 right-4 md:right-6 flex gap-2'>
						<ThemeToggle />
					</div>

					<div className='absolute top-0 left-4 md:left-6 flex gap-2'>
						<LanguageSelector />
					</div>

					<h1
						className={`text-4xl md:text-5xl font-bold ${THEME_STYLES.text.primary[theme]} mb-2`}
					>
						🎯 Funny Spinner 🎯
					</h1>
					<p className={`${THEME_STYLES.text.secondary[theme]} text-lg`}>
						{t('wizard.subtitle')}
					</p>
					<motion.button
						type='button'
						onClick={handleReset}
						className={`mt-4 px-4 py-2 text-sm rounded-lg transition-colors font-medium ${
							theme === 'light'
								? 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
								: 'bg-gray-700 text-gray-300 border border-gray-600 hover:bg-gray-600'
						}`}
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
					>
						🔄 {t('wizard.resetAll')}
					</motion.button>
				</motion.div>

				{/* 2-Column Layout */}
				<div className='grid grid-cols-1 lg:grid-cols-2 gap-8 items-start'>
					{/* Left Column - Custom Input */}
					<motion.div
						className={`${THEME_STYLES.cards[theme]} rounded-2xl shadow-xl p-6 order-2 lg:order-1`}
						initial={{ x: -50, opacity: 0 }}
						animate={{ x: 0, opacity: 1 }}
						transition={{ ...ANIMATION_CONFIG.spring, delay: 0.2 }}
					>
						<div className='text-center mb-6'>
							<h2
								className={`text-2xl font-bold ${THEME_STYLES.text.primary[theme]} mb-2`}
							>
								{t('wizard.customSpinner')}
							</h2>
							<p className={THEME_STYLES.text.secondary[theme]}>
								{t('wizard.customDescription')}
							</p>
						</div>

						<form onSubmit={handleSubmit} className='space-y-6'>
							<div>
								<label
									htmlFor='question'
									className={`block text-sm font-medium ${THEME_STYLES.text.primary[theme]} mb-2`}
								>
									{t('wizard.question.label')}
								</label>
								<input
									id='question'
									type='text'
									value={question}
									onChange={e => {
										setQuestion(e.target.value);
										setError(null);
									}}
									placeholder={t('wizard.question.placeholder')}
									className={`w-full px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
										theme === 'light'
											? 'border border-gray-300 bg-white text-gray-900'
											: 'border border-gray-600 bg-gray-700 text-gray-100'
									}`}
								/>
							</div>

							<div>
								<label
									className={`block text-sm font-medium ${THEME_STYLES.text.primary[theme]} mb-2`}
								>
									{t('wizard.options.label')}
								</label>
								<div className='space-y-3'>
									{items.map((item, index) => (
										<motion.div
											key={index}
											className='flex gap-2'
											initial={{ x: -20, opacity: 0 }}
											animate={{ x: 0, opacity: 1 }}
											transition={{ delay: index * 0.1 }}
										>
											<input
												type='text'
												value={item}
												onChange={e => {
													updateItem(index, e.target.value);
													setError(null);
												}}
												placeholder={`${t('wizard.options.placeholder')} ${
													index + 1
												}`}
												className={`flex-1 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
													theme === 'light'
														? 'border border-gray-300 bg-white text-gray-900'
														: 'border border-gray-600 bg-gray-700 text-gray-100'
												}`}
											/>
											{items.length > 2 && (
												<motion.button
													type='button'
													onClick={() => removeItem(index)}
													className={`px-3 py-2 rounded-lg transition-colors ${
														theme === 'light'
															? 'text-red-600 hover:bg-red-50'
															: 'text-red-400 hover:bg-red-900/20'
													}`}
													whileHover={{ scale: 1.1 }}
													whileTap={{ scale: 0.9 }}
												>
													✕
												</motion.button>
											)}
										</motion.div>
									))}
								</div>

								{items.length < 10 && (
									<motion.button
										type='button'
										onClick={addItem}
										className={`mt-3 w-full py-2 border-2 border-dashed rounded-lg transition-colors ${
											theme === 'light'
												? 'border-gray-300 text-gray-600 hover:border-blue-400 hover:text-blue-600'
												: 'border-gray-600 text-gray-400 hover:border-blue-400 hover:text-blue-400'
										}`}
										whileHover={{ scale: 1.02 }}
										whileTap={{ scale: 0.98 }}
									>
										+ {t('wizard.addOption')}
									</motion.button>
								)}
							</div>

							{error && (
								<motion.div
									className={`rounded-lg p-3 ${
										theme === 'light'
											? 'bg-red-50 border border-red-200'
											: 'bg-red-900/20 border border-red-800'
									}`}
									initial={{ scale: 0.9, opacity: 0 }}
									animate={{ scale: 1, opacity: 1 }}
									transition={ANIMATION_CONFIG.bounce}
								>
									<p
										className={`text-sm ${
											theme === 'light' ? 'text-red-600' : 'text-red-400'
										}`}
									>
										{error}
									</p>
								</motion.div>
							)}

							<motion.button
								type='submit'
								className='w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors'
								whileHover={{ scale: 1.02 }}
								whileTap={{ scale: 0.98 }}
							>
								{t('wizard.createSpinner')}
							</motion.button>
						</form>
					</motion.div>

					{/* Right Column - Presets */}
					<motion.div
						className={`${THEME_STYLES.cards[theme]} rounded-2xl shadow-xl p-6 order-1 lg:order-2`}
						initial={{ x: 50, opacity: 0 }}
						animate={{ x: 0, opacity: 1 }}
						transition={{ ...ANIMATION_CONFIG.spring, delay: 0.4 }}
					>
						<div className='text-center mb-6'>
							<h2
								className={`text-2xl font-bold ${THEME_STYLES.text.primary[theme]} mb-2`}
							>
								{t('wizard.quickStart')}
							</h2>
							<p className={THEME_STYLES.text.secondary[theme]}>
								{t('wizard.quickStartDescription')}
							</p>
						</div>

						<div className='space-y-3 max-h-80 lg:max-h-96 overflow-y-auto scrollable-area'>
							{PRESETS.map((preset, index) => (
								<motion.button
									key={preset.id}
									type='button'
									onClick={() => handlePresetClick(preset)}
									className={`w-full px-4 py-3 text-sm rounded-lg transition-colors text-left ${
										theme === 'light'
											? 'bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100'
											: 'bg-blue-900/20 text-blue-300 border border-blue-800 hover:bg-blue-900/30'
									}`}
									initial={{ y: 20, opacity: 0 }}
									animate={{ y: 0, opacity: 1 }}
									transition={{ delay: 0.6 + index * 0.05 }}
									whileTap={{ scale: 0.98 }}
								>
									<div className='font-medium text-base mb-1'>
										{preset.question}
									</div>
									<div
										className={`text-xs ${
											theme === 'light' ? 'text-blue-600' : 'text-blue-400'
										}`}
									>
										{preset.answers.length} options:{' '}
										{preset.answers.slice(0, 3).join(', ')}
										{preset.answers.length > 3 ? '...' : ''}
									</div>
								</motion.button>
							))}
						</div>
					</motion.div>
				</div>
			</div>
		</div>
	);
};
