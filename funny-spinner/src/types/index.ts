/**
 * Core application types
 */

export interface SpinnerItem {
	id: string;
	text: string;
	color: string;
}

export interface GameData {
	question: string;
	items: SpinnerItem[];
}

export interface Preset {
	id: string;
	question: string;
	answers: string[];
}

export interface SpinnerState {
	isSpinning: boolean;
	result: SpinnerItem | null;
	rotation: number;
}

/**
 * Utility types
 */
export type SpinResult = {
	item: SpinnerItem;
	rotation: number;
	duration: number;
};

export type ValidationResult = string | null;
