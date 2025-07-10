import {
	DEFAULT_COLORS,
	SPINNER_CONFIG,
	VALIDATION_MESSAGES,
} from '../constants';
import type { SpinnerItem } from '../types';

/**
 * Generates colors for spinner sections
 * @param count Number of sections needed
 * @returns Array of color strings
 */
export const generateColors = (count: number): string[] => {
	if (count <= DEFAULT_COLORS.length) {
		return DEFAULT_COLORS.slice(0, count);
	}

	const additionalColors = [];
	for (let i = DEFAULT_COLORS.length; i < count; i++) {
		const hue = (i * 137.508) % 360; // Golden angle approximation
		additionalColors.push(`hsl(${hue}, 70%, 60%)`);
	}

	return [...DEFAULT_COLORS, ...additionalColors];
};

/**
 * Creates spinner items from text array with generated colors
 * @param texts Array of text options
 * @returns Array of SpinnerItem objects
 */
export const createSpinnerItems = (texts: string[]): SpinnerItem[] => {
	const colors = generateColors(texts.length);
	return texts.map((text, index) => ({
		id: `item-${index}`,
		text,
		color: colors[index],
	}));
};

/**
 * Calculates the angle for each section of the spinner
 * @param totalItems Number of total items
 * @returns Angle in degrees
 */
export const calculateSectionAngle = (totalItems: number): number => {
	return 360 / totalItems;
};

/**
 * Generates a random spin result with rotation and duration
 * @param items Array of spinner items
 * @returns Object containing selected item, rotation angle, and duration
 */
export const generateSpinResult = (
	items: SpinnerItem[]
): { item: SpinnerItem; rotation: number; duration: number } => {
	const randomIndex = Math.floor(Math.random() * items.length);
	const sectionAngle = calculateSectionAngle(items.length);

	// Calculate duration (5-10 seconds)
	const duration =
		SPINNER_CONFIG.MIN_DURATION +
		Math.random() * (SPINNER_CONFIG.MAX_DURATION - SPINNER_CONFIG.MIN_DURATION);

	// Calculate rotation based on duration for consistent animation speed
	const rotationsPerSecond = 2.0; // Base rotation speed
	const totalRotations = (duration / 1000) * rotationsPerSecond; // Total rotations based on duration

	// Calculate target angle to align the selected item with the top arrow
	// The arrow points down from the top (0 degrees), so we want the center of the selected section to be at 0 degrees
	const currentItemAngle = randomIndex * sectionAngle + sectionAngle / 2; // Center of the selected section
	const angleToRotate = (360 - currentItemAngle + 0) % 360; // How much to rotate to align with arrow

	const totalRotation = totalRotations * 360 + angleToRotate; // Multiple full rotations + precise alignment

	return {
		item: items[randomIndex],
		rotation: totalRotation,
		duration: duration,
	};
};

/**
 * Validates user input for question and items
 * @param question The question text
 * @param items Array of item texts
 * @param t Translation function (optional, falls back to default messages)
 * @returns Error message if validation fails, null if valid
 */
export const validateInput = (
	question: string,
	items: string[],
	t?: (key: string) => string
): string | null => {
	if (!question.trim()) {
		return t ? t('wizard.error.question') : VALIDATION_MESSAGES.EMPTY_QUESTION;
	}

	if (items.length < SPINNER_CONFIG.MIN_ITEMS) {
		return t ? t('wizard.error.minOptions') : VALIDATION_MESSAGES.MIN_ITEMS;
	}

	if (items.length > SPINNER_CONFIG.MAX_ITEMS) {
		return `Maximum ${SPINNER_CONFIG.MAX_ITEMS} items allowed`;
	}

	const nonEmptyItems = items.filter(item => item.trim());
	if (nonEmptyItems.length !== items.length) {
		return t ? t('wizard.error.emptyOption') : VALIDATION_MESSAGES.EMPTY_ITEMS;
	}

	// Check for duplicates
	const uniqueItems = new Set(
		nonEmptyItems.map(item => item.trim().toLowerCase())
	);
	if (uniqueItems.size !== nonEmptyItems.length) {
		return t
			? t('wizard.error.duplicateOption')
			: VALIDATION_MESSAGES.DUPLICATE_ITEMS;
	}

	return null;
};
