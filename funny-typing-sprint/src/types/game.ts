export interface GameState {
	isActive: boolean;
	timeLeft: number;
	duration: number;
	currentSentenceIndex: number;
	currentInput: string;
	sentences: string[];
	startTime: number | null;
	totalTyped: number;
	correctChars: number;
	errors: number;
	wordsTyped: number;
}

export interface GameMetrics {
	accuracy: number;
	wpm: number;
	spm: number;
	errors: number;
	duration: number;
	wordsTyped: number;
}

export type TimeDuration = 5 | 10 | 15 | 30 | 60;
