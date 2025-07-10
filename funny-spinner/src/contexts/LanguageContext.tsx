import React, {
	createContext,
	useEffect,
	useState,
	type ReactNode,
} from 'react';

export type SupportedLanguage = 'en' | 'uk' | 'pl';

export interface LanguageContextType {
	language: SupportedLanguage;
	setLanguage: (lang: SupportedLanguage) => void;
	t: (key: string) => string;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(
	undefined
);

interface LanguageProviderProps {
	children: ReactNode;
}

/**
 * Detects user's preferred language from browser settings
 */
const detectBrowserLanguage = (): SupportedLanguage => {
	const browserLang = navigator.language.toLowerCase();

	if (browserLang.startsWith('uk')) return 'uk';
	if (browserLang.startsWith('pl')) return 'pl';
	return 'en'; // Default to English
};

/**
 * Gets saved language from localStorage or detects from browser
 */
const getInitialLanguage = (): SupportedLanguage => {
	const saved = localStorage.getItem(
		'funny-spinner-language'
	) as SupportedLanguage;
	if (saved && ['en', 'uk', 'pl'].includes(saved)) {
		return saved;
	}
	return detectBrowserLanguage();
};

export const LanguageProvider: React.FC<LanguageProviderProps> = ({
	children,
}) => {
	const [language, setLanguageState] =
		useState<SupportedLanguage>(getInitialLanguage);

	const setLanguage = (lang: SupportedLanguage) => {
		setLanguageState(lang);
		localStorage.setItem('funny-spinner-language', lang);
	};

	// Import translations dynamically
	const [translations, setTranslations] = useState<Record<string, string>>({});

	useEffect(() => {
		const loadTranslations = async () => {
			try {
				const module = await import(`../locales/${language}.ts`);
				setTranslations(module.default);
			} catch {
				console.warn(
					`Failed to load translations for ${language}, falling back to English`
				);
				const module = await import('../locales/en');
				setTranslations(module.default);
			}
		};

		loadTranslations();
	}, [language]);

	const t = (key: string): string => {
		return translations[key] || key;
	};

	return (
		<LanguageContext.Provider value={{ language, setLanguage, t }}>
			{children}
		</LanguageContext.Provider>
	);
};
