// Rap couplet templates for the RAPIFY feature
export const coupletTemplates = [
	"I came to grind, my flow's sublime — <WORD> in the headline\nDroppin' heat that's so damn sweet, it rhymes with <R1> and <R2> every time",

	"Step to the mic with <WORD> on my mind\nSpittin' fire with <R1> and <R2>, leave the haters behind",

	"From the streets to the beat, I bring the <WORD> heat\nMy rhymes are so divine, like <R1> and <R2>, can't compete",

	"Listen up close, I'm the lyrical <WORD> ghost\nFlowing smooth like <R1>, hitting hard like <R2>, coast to coast",

	'In the studio late, crafting bars with <WORD> fate\nMixing <R1> with <R2>, these rhymes I create',

	"Yo, check it out, I'm all about that <WORD> clout\nGot <R1> in my pocket and <R2> without a doubt",

	"Started from the bottom with a <WORD> in my soul\nNow I'm spitting <R1> and <R2>, that's how I roll",

	"They said I couldn't make it with my <WORD> style\nBut I proved them wrong with <R1> and <R2>, mile by mile",

	"In the cipher we gather, talking 'bout <WORD> matter\nDropping knowledge like <R1>, wisdom like <R2>, no chatter",

	"Break it down now, let me tell you 'bout <WORD>\nGot the crowd going crazy with <R1> and <R2>, that's my word",

	'Fresh out the gate with <WORD> on my plate\nServing up <R1> and <R2>, sealed my fate',

	"Underground king with a <WORD> on my ring\nSpitting <R1> and <R2>, that's the vibe I bring",

	'Microphone check, put some <WORD> in my flow\nMixing <R1> with <R2>, watch my legend grow',

	"Back in the day, we used to play with <WORD>\nNow I'm on stage dropping <R1> and <R2>, that's preferred",

	'Turn the beat up, let me speak about <WORD>\nWith <R1> and <R2> in the mix, my rhymes are heard',

	'Freestyle Friday, got <WORD> on my brain\nCombining <R1> and <R2>, driving crowds insane',

	'Pen to the paper, <WORD> is my flavor\nBlending <R1> with <R2>, audience I savor',

	'Late night sessions, <WORD> is my obsession\nWeaving <R1> and <R2> in lyrical progression',

	"From the east to the west, <WORD> stands the test\nWith <R1> and <R2> combined, I'm simply the best",

	"Old school vibes with a <WORD> twist\nGot <R1> and <R2> on my playlist, can't resist",
];

// Function to generate a random rap couplet
export function generateCouplet(
	word: string,
	rhyme1: string,
	rhyme2: string
): string {
	const template =
		coupletTemplates[Math.floor(Math.random() * coupletTemplates.length)];

	return template
		.replace('<WORD>', word)
		.replace('<R1>', rhyme1)
		.replace('<R2>', rhyme2);
}

export default coupletTemplates;
