import { useEffect, useState } from 'react';

interface PWAInstallPrompt extends Event {
	prompt: () => Promise<void>;
	userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

interface PWAState {
	isInstallable: boolean;
	isInstalled: boolean;
	isOffline: boolean;
	updateAvailable: boolean;
}

export const usePWA = () => {
	const [state, setState] = useState<PWAState>({
		isInstallable: false,
		isInstalled: false,
		isOffline: !navigator.onLine,
		updateAvailable: false,
	});

	const [installPrompt, setInstallPrompt] = useState<PWAInstallPrompt | null>(
		null
	);
	const [registration, setRegistration] =
		useState<ServiceWorkerRegistration | null>(null);

	useEffect(() => {
		// Register service worker
		const registerSW = async () => {
			if ('serviceWorker' in navigator) {
				try {
					const reg = await navigator.serviceWorker.register('/sw.js');
					setRegistration(reg);

					console.log('[PWA] Service worker registered successfully');

					// Check for updates
					reg.addEventListener('updatefound', () => {
						const newWorker = reg.installing;
						if (newWorker) {
							newWorker.addEventListener('statechange', () => {
								if (
									newWorker.state === 'installed' &&
									navigator.serviceWorker.controller
								) {
									setState(prev => ({ ...prev, updateAvailable: true }));
								}
							});
						}
					});
				} catch (error) {
					console.error('[PWA] Service worker registration failed:', error);
				}
			}
		};

		registerSW();

		// Check if app is already installed
		const checkInstalled = () => {
			const isStandalone = window.matchMedia(
				'(display-mode: standalone)'
			).matches;
			const isIOSStandalone =
				'standalone' in window.navigator &&
				(window.navigator as Navigator & { standalone?: boolean })
					.standalone === true;
			setState(prev => ({
				...prev,
				isInstalled: isStandalone || isIOSStandalone,
			}));
		};

		checkInstalled();

		// Listen for install prompt
		const handleBeforeInstallPrompt = (e: Event) => {
			e.preventDefault();
			setInstallPrompt(e as PWAInstallPrompt);
			setState(prev => ({ ...prev, isInstallable: true }));
		};

		// Listen for app installed
		const handleAppInstalled = () => {
			setInstallPrompt(null);
			setState(prev => ({
				...prev,
				isInstallable: false,
				isInstalled: true,
			}));
			console.log('[PWA] App was installed');
		};

		// Listen for online/offline status
		const handleOnline = () =>
			setState(prev => ({ ...prev, isOffline: false }));
		const handleOffline = () =>
			setState(prev => ({ ...prev, isOffline: true }));

		// Add event listeners
		window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
		window.addEventListener('appinstalled', handleAppInstalled);
		window.addEventListener('online', handleOnline);
		window.addEventListener('offline', handleOffline);

		// Cleanup
		return () => {
			window.removeEventListener(
				'beforeinstallprompt',
				handleBeforeInstallPrompt
			);
			window.removeEventListener('appinstalled', handleAppInstalled);
			window.removeEventListener('online', handleOnline);
			window.removeEventListener('offline', handleOffline);
		};
	}, []);

	const installApp = async () => {
		if (!installPrompt) return false;

		try {
			await installPrompt.prompt();
			const choiceResult = await installPrompt.userChoice;

			if (choiceResult.outcome === 'accepted') {
				console.log('[PWA] User accepted the install prompt');
				return true;
			} else {
				console.log('[PWA] User dismissed the install prompt');
				return false;
			}
		} catch (error) {
			console.error('[PWA] Install failed:', error);
			return false;
		}
	};

	const updateApp = async () => {
		if (!registration || !registration.waiting) return;

		// Tell the waiting service worker to skip waiting
		registration.waiting.postMessage({ type: 'SKIP_WAITING' });

		// Reload the page to use the new service worker
		window.location.reload();
	};

	const shareApp = async () => {
		const shareData = {
			title: '🎯 Funny Spinner - Decision Maker',
			text: 'Make decisions fun with this beautiful spinner app!',
			url: window.location.origin,
		};

		if (navigator.share) {
			try {
				await navigator.share(shareData);
				return true;
			} catch (error) {
				console.error('[PWA] Share failed:', error);
				return false;
			}
		} else {
			// Fallback to clipboard
			try {
				await navigator.clipboard.writeText(window.location.origin);
				return true;
			} catch (error) {
				console.error('[PWA] Clipboard write failed:', error);
				return false;
			}
		}
	};

	return {
		...state,
		installApp,
		updateApp,
		shareApp,
		canInstall: state.isInstallable && !state.isInstalled,
	};
};
