import type { GameMetrics, GameState } from '../types/game';

export function calculateMetrics(gameState: GameState): GameMetrics {
	const timeElapsed = gameState.duration - gameState.timeLeft;
	const timeInMinutes = timeElapsed / 60;

	const accuracy =
		gameState.totalTyped > 0
			? (gameState.correctChars / gameState.totalTyped) * 100
			: 0;
	const wpm = timeInMinutes > 0 ? gameState.wordsTyped / timeInMinutes : 0;
	const spm = timeInMinutes > 0 ? gameState.correctChars / timeInMinutes : 0;

	return {
		accuracy: Math.round(accuracy * 100) / 100,
		wpm: Math.round(wpm * 100) / 100,
		spm: Math.round(spm * 100) / 100,
		errors: gameState.errors,
		duration: timeElapsed,
		wordsTyped: gameState.wordsTyped,
	};
}

export function updateBackgroundOpacity(errors: number): number {
	// Start at 100% opacity (1.0) and reduce to minimum 20% (0.2)
	const maxErrors = 40; // After 40 errors, opacity reaches minimum
	const minOpacity = 0.2;
	const maxOpacity = 1.0;

	const opacityReduction =
		Math.min(errors / maxErrors, 1) * (maxOpacity - minOpacity);
	return maxOpacity - opacityReduction;
}

export function countWords(text: string): number {
	return text
		.trim()
		.split(/\s+/)
		.filter(word => word.length > 0).length;
}

export function getCurrentSentence(sentences: string[], index: number): string {
	return sentences[index] || '';
}

export function getDisplayText(
	sentences: string[],
	currentIndex: number,
	numSentences: number = 3
): string {
	const displaySentences = [];
	for (
		let i = 0;
		i < numSentences && currentIndex + i < sentences.length;
		i++
	) {
		displaySentences.push(sentences[currentIndex + i]);
	}
	return displaySentences.join(' ');
}

export function formatTime(seconds: number): string {
	const mins = Math.floor(seconds / 60);
	const secs = seconds % 60;
	return mins > 0 ? `${mins}:${secs.toString().padStart(2, '0')}` : `${secs}s`;
}
