import React, { createContext, useEffect, useState } from 'react';

export type Theme = 'light' | 'dark';

interface ThemeContextType {
	theme: Theme;
	toggleTheme: () => void;
	setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export { ThemeContext };

/**
 * Theme provider component that manages theme state
 */
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [theme, setThemeState] = useState<Theme>(() => {
		// Check localStorage first, then system preference
		const savedTheme = localStorage.getItem('funny-spinner-theme') as Theme;
		if (savedTheme) return savedTheme;

		// Check system preference
		if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
			return 'dark';
		}
		return 'light';
	});

	const setTheme = (newTheme: Theme) => {
		setThemeState(newTheme);
		localStorage.setItem('funny-spinner-theme', newTheme);

		// Update document class for Tailwind dark mode
		if (newTheme === 'dark') {
			document.documentElement.classList.add('dark');
		} else {
			document.documentElement.classList.remove('dark');
		}
	};

	const toggleTheme = () => {
		setTheme(theme === 'light' ? 'dark' : 'light');
	};

	// Initialize theme on mount
	useEffect(() => {
		setTheme(theme);
	}, [theme]);

	// Listen for system theme changes
	useEffect(() => {
		const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
		const handleChange = (e: MediaQueryListEvent) => {
			// Only update if user hasn't manually set a preference
			if (!localStorage.getItem('funny-spinner-theme')) {
				setTheme(e.matches ? 'dark' : 'light');
			}
		};

		mediaQuery.addEventListener('change', handleChange);
		return () => mediaQuery.removeEventListener('change', handleChange);
	}, []);

	return (
		<ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
			{children}
		</ThemeContext.Provider>
	);
};
