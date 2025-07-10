import { config } from '../config';

// Base64 encoded sound data for small WAV files
export const sounds = {
	// Short beep sound (440Hz tone, 100ms)
	beep: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmgfCjiR2e/EcSgFKHzQ8dGFLwYVaLjr2qcvFAQ+ltjz0IsaCjFjrLOAag',

	// Short keystroke sound (click)
	keystroke:
		'data:audio/wav;base64,UklGRrIBAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YY4BAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmgfCDiR2e/EcSgFKHzQ8dGFLwYVaLjr2qcvFAQ+ltjz0IsaCjFjrKOAagfGhpKIZGVlcZ2sopVkTEZlp9bcp20gBT6W2/LDciYGI4HI8NiIOQkWaa3o2KRKFAo9itXvwnEhBTaK0+/GcyAGJHzM7deJOAkWaa3o2aJJFAo9jdLtw3MiBDWJ1O/BdCEGI4XI8dWJOQgXa63n16FKEwg+jNPvxnUjBDaJ1O/BdCEGJH/N7tiJOAoUaKzm2KlDEwk1jNbww3WBDH/M7tiJOAoUaKzm2KlDEwk1jNbww3Y',

	// Slurp sound for coffee brewing
	slurp:
		'data:audio/wav;base64,UklGRtgDAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YbQDAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmgfCDiR2e/EcSgFKHzQ8dGFLwYVaLjr2qcvFAQ+ltjz0IsaCjFjrKOAagfGhpKIZGVlcZ2sopVkTEZlp9bcp20gBT6W2/LDciYGI4HI8NiIOQkWaa3o2KRKFAo9itXvwnEhBTaK0+/GcyAGJHzM7deJOAkWaa3o2aJJFAo9jdLtw3MiBDWJ1O/BdCEGI4XI8dWJOQgXa63n16FKEwg+jNPvxnUjBDaJ1O/BdCEGJH/N7tiJOAoUaKzm2KlDEwk1jNbww3U=',
};

export const playSound = (soundKey: keyof typeof sounds): void => {
	if (!config.soundEnabled) return;

	try {
		const audio = new Audio(sounds[soundKey]);
		audio.volume = 0.3;
		audio.play().catch(() => {
			// Ignore audio play failures (browser restrictions)
		});
	} catch (error) {
		// Ignore audio creation/play failures
	}
};
