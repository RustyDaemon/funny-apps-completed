// Color utility functions

/**
 * Converts HSL color values to a hex string
 * @param h - Hue (0-359)
 * @param s - Saturation (0-100)
 * @param l - Lightness (0-100)
 * @returns Hex color string (e.g. "#FF69B4")
 */
export const hslToHex = (h: number, s: number, l: number): string => {
	// Normalize values
	h = h % 360;
	s = Math.max(0, Math.min(100, s)) / 100;
	l = Math.max(0, Math.min(100, l)) / 100;

	// Algorithm to convert HSL to RGB
	const c = (1 - Math.abs(2 * l - 1)) * s;
	const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
	const m = l - c / 2;

	let r = 0,
		g = 0,
		b = 0;

	if (h < 60) {
		[r, g, b] = [c, x, 0];
	} else if (h < 120) {
		[r, g, b] = [x, c, 0];
	} else if (h < 180) {
		[r, g, b] = [0, c, x];
	} else if (h < 240) {
		[r, g, b] = [0, x, c];
	} else if (h < 300) {
		[r, g, b] = [x, 0, c];
	} else {
		[r, g, b] = [c, 0, x];
	}

	// Convert to hex
	const toHex = (val: number): string => {
		const hex = Math.round((val + m) * 255).toString(16);
		return hex.length === 1 ? '0' + hex : hex;
	};

	return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
};

/**
 * Gets a CSS hsl() string from HSL values
 * @param h - Hue (0-359)
 * @param s - Saturation (0-100)
 * @param l - Lightness (0-100)
 * @returns CSS hsl() string
 */
export const getHslString = (h: number, s: number, l: number): string => {
	return `hsl(${h}, ${s}%, ${l}%)`;
};

/**
 * Determines if a color is perceived as light (true) or dark (false)
 * Uses the HSP (Highly Sensitive Poo) color model for better perceptual brightness
 * @param h - Hue (0-359)
 * @param s - Saturation (0-100)
 * @param l - Lightness (0-100)
 * @returns Boolean indicating if the color is light
 */
export const isLightColor = (h: number, s: number, l: number): boolean => {
	// For very light or very dark colors, we can determine directly from lightness
	if (l > 80) return true;
	if (l < 20) return false;

	// For other colors, convert to RGB and use HSP model
	// Normalize values
	h = h % 360;
	s = Math.max(0, Math.min(100, s)) / 100;
	l = Math.max(0, Math.min(100, l)) / 100;

	// Convert to RGB (0-1 range)
	const c = (1 - Math.abs(2 * l - 1)) * s;
	const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
	const m = l - c / 2;

	let r = 0,
		g = 0,
		b = 0;

	if (h < 60) {
		[r, g, b] = [c, x, 0];
	} else if (h < 120) {
		[r, g, b] = [x, c, 0];
	} else if (h < 180) {
		[r, g, b] = [0, c, x];
	} else if (h < 240) {
		[r, g, b] = [0, x, c];
	} else if (h < 300) {
		[r, g, b] = [x, 0, c];
	} else {
		[r, g, b] = [c, 0, x];
	}

	// Convert to 0-255 range
	const R = Math.round((r + m) * 255);
	const G = Math.round((g + m) * 255);
	const B = Math.round((b + m) * 255);

	// HSP (Highly Sensitive Poo) equation from http://alienryderflex.com/hsp.html
	const hsp = Math.sqrt(0.299 * (R * R) + 0.587 * (G * G) + 0.114 * (B * B));

	// hsp > 127.5 indicates a light color
	return hsp > 127.5;
};
