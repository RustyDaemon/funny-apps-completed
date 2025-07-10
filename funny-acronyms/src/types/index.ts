export interface PickState {
	index: number;
	word: string;
	locked: boolean;
}

export interface AppState {
	acronym: string;
	picks: PickState[];
}

export interface ReelProps {
	letter: string;
	words: string[];
	locked: boolean;
	onToggleLock: () => void;
	isSpinning: boolean;
	finalWord: string;
	onSpinComplete: () => void;
}
