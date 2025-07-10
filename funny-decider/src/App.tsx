import DeciderApp from './components/DeciderApp';
import ThemeSwitcher from './components/ThemeSwitcher';
import { ThemeProvider } from './contexts/ThemeContext';

function App() {
	return (
		<ThemeProvider>
			<div className='min-h-screen flex flex-col items-center justify-center py-12 px-4'>
				<ThemeSwitcher />
				<DeciderApp />

				<footer className='mt-12 text-center text-sm text-[rgb(var(--foreground))] opacity-50'>
					<p>© {new Date().getFullYear()} Funny Decider</p>
				</footer>
			</div>
		</ThemeProvider>
	);
}

export default App;
