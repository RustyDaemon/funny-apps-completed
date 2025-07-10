export interface Verdict {
	text: string;
	emoji: string;
}

// Verdicts based on reaction time - 6 levels + grandpa mode
export const getVerdict = (ms: number): Verdict => {
	if (ms < 50) return { text: 'Superhuman!', emoji: '🚀' };
	if (ms < 100) return { text: 'Lightning!', emoji: '⚡' };
	if (ms < 150) return { text: 'Incredible!', emoji: '🔥' };
	if (ms < 250) return { text: 'Quick fingers!', emoji: '👆' };
	if (ms < 350) return { text: 'Pretty good!', emoji: '👍' };
	if (ms < 450) return { text: 'Not bad!', emoji: '👌' };
	if (ms < 550) return { text: 'Meh...', emoji: '😐' };
	if (ms < 700) return { text: 'Getting old?', emoji: '🧓' };
	if (ms < 900) return { text: 'Slowpoke!', emoji: '🐢' };
	return { text: 'Grandpa mode.', emoji: '⏳' };
};

// LocalStorage keys with project prefix
export const STORAGE_KEYS = {
	best: 'frt-best-score',
	worst: 'frt-worst-score',
};

export type GameState = 'idle' | 'waiting' | 'ready' | 'scored';
