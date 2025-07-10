import { useState } from 'react';
import type { SpinnerItem } from '../types';

interface UseSpinnerStateReturn {
	isSpinning: boolean;
	result: SpinnerItem | null;
	setSpinning: (spinning: boolean) => void;
	setResult: (result: SpinnerItem | null) => void;
	reset: () => void;
}

/**
 * Custom hook for managing spinner UI state
 */
export const useSpinnerState = (): UseSpinnerStateReturn => {
	const [isSpinning, setIsSpinning] = useState(false);
	const [result, setResultState] = useState<SpinnerItem | null>(null);

	const setSpinning = (spinning: boolean) => {
		setIsSpinning(spinning);
	};

	const setResult = (newResult: SpinnerItem | null) => {
		setResultState(newResult);
		if (newResult) {
			setIsSpinning(false);
		}
	};

	const reset = () => {
		setIsSpinning(false);
		setResultState(null);
	};

	return {
		isSpinning,
		result,
		setSpinning,
		setResult,
		reset,
	};
};
