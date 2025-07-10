// Mood words mapped to different hue ranges
export type ColorRange = {
	baseColor: string;
	minHue: number;
	maxHue: number;
};

// Color base names for different hue ranges
export const colorRanges: ColorRange[] = [
	{ baseColor: 'Red', minHue: 0, maxHue: 15 },
	{ baseColor: 'Orange', minHue: 16, maxHue: 35 },
	{ baseColor: 'Amber', minHue: 36, maxHue: 45 },
	{ baseColor: 'Yellow', minHue: 46, maxHue: 60 },
	{ baseColor: 'Lime', minHue: 61, maxHue: 80 },
	{ baseColor: 'Green', minHue: 81, maxHue: 120 },
	{ baseColor: 'Teal', minHue: 121, maxHue: 160 },
	{ baseColor: 'Cyan', minHue: 161, maxHue: 190 },
	{ baseColor: 'Sky', minHue: 191, maxHue: 210 },
	{ baseColor: 'Blue', minHue: 211, maxHue: 240 },
	{ baseColor: 'Indigo', minHue: 241, maxHue: 265 },
	{ baseColor: 'Purple', minHue: 266, maxHue: 290 },
	{ baseColor: 'Magenta', minHue: 291, maxHue: 330 },
	{ baseColor: 'Pink', minHue: 331, maxHue: 359 },
];

// Adjectives to describe colors
const adjectives = [
	// Warm/energetic adjectives (good for reds/oranges/yellows)
	'Fiery',
	'Energetic',
	'Vibrant',
	'Blazing',
	'Radiant',
	'Glowing',
	'Passionate',
	'Intense',
	'Lively',
	'Dynamic',
	'Burning',
	'Sizzling',
	'Warm',
	'Bright',
	'Bold',

	// Cool/calming adjectives (good for blues/greens/purples)
	'Soothing',
	'Peaceful',
	'Tranquil',
	'Calm',
	'Serene',
	'Refreshing',
	'Gentle',
	'Harmonious',
	'Relaxing',
	'Dreamy',
	'Cool',
	'Breezy',
	'Misty',
	'Soft',
	'Quiet',

	// Playful/creative adjectives (good for any color)
	'Playful',
	'Cheerful',
	'Joyful',
	'Magical',
	'Whimsical',
	'Enchanted',
	'Mysterious',
	'Fancy',
	'Electric',
	'Cosmic',
	'Dazzling',
	'Sparkling',
	'Dancing',
	'Excited',
	'Wild',

	// Descriptive modifiers
	'Deep',
	'Mellow',
	'Rich',
	'Vivid',
	'Brilliant',
	'Pure',
	'Dusty',
	'Neon',
	'Shimmering',
	'Gleaming',
];

// Nouns that can be paired with colors
const nouns = [
	// Nature
	'Sunset',
	'Dawn',
	'Twilight',
	'Ocean',
	'Forest',
	'Meadow',
	'Desert',
	'Mountain',
	'Jungle',
	'Garden',
	'Bloom',
	'Petal',
	'Leaf',
	'Sky',
	'Cloud',

	// Fruits and foods
	'Berry',
	'Cherry',
	'Apple',
	'Grape',
	'Peach',
	'Plum',
	'Lime',
	'Lemon',
	'Candy',
	'Honey',
	'Cream',
	'Jam',
	'Spice',
	'Mint',
	'Nectar',

	// Elements and materials
	'Crystal',
	'Ember',
	'Flame',
	'Mist',
	'Wave',
	'Shadow',
	'Glow',
	'Jewel',
	'Velvet',
	'Silk',
	'Glass',
	'Frost',
	'Dew',
	'Steam',
	'Diamond',

	// Celestial
	'Star',
	'Moon',
	'Comet',
	'Aurora',
	'Nebula',
	'Galaxy',
	'Planet',
	'Orbit',
	'Cosmos',
	'Astral',
];

/**
 * Gets a dynamic mood label based on the current hue value
 * @param hue - Current hue (0-359)
 * @returns A dynamically generated mood label string
 */
export const getMoodLabel = (hue: number): string => {
	const normalizedHue = hue % 360;

	// Find the corresponding color range
	const colorRange = colorRanges.find(
		range => normalizedHue >= range.minHue && normalizedHue <= range.maxHue
	);

	if (!colorRange) {
		return 'Mysterious Mood';
	}

	// Get a consistent adjective based on the hue
	// This ensures the same hue always gets the same descriptor
	const adjectiveIndex = Math.floor((normalizedHue * 7) % adjectives.length);
	const adjective = adjectives[adjectiveIndex];

	// Get a noun that feels appropriate (optional, 50% chance)
	let nounPhrase = '';
	const useNoun = Math.random() > 0.5;

	if (useNoun) {
		const nounIndex = Math.floor((normalizedHue * 13) % nouns.length);
		const noun = nouns[nounIndex];
		nounPhrase = ` ${noun}`;
	}

	return `${adjective}${nounPhrase} ${colorRange.baseColor}`;
};
