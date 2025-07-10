export const jokes: string[] = [
	"Why don't scientists trust atoms? Because they make up everything!",
	'I told my wife she was drawing her eyebrows too high. She looked surprised.',
	'Why do chicken coops only have two doors? Because if they had four, they would be chicken sedans!',
	'What do you call a fake noodle? An impasta!',
	"Why don't skeletons fight each other? They don't have the guts.",
	'What do you get when you cross a snowman with a vampire? Frostbite!',
	'I used to hate facial hair, but then it grew on me.',
	"Why can't a bicycle stand up by itself? It's two tired!",
	'What did the ocean say to the beach? Nothing, it just waved.',
	"Why don't eggs tell jokes? They'd crack each other up!",
	"I'm reading a book about anti-gravity. It's impossible to put down!",
	'Why did the scarecrow win an award? He was outstanding in his field!',
	'What do you call a dinosaur that crashes his car? Tyrannosaurus Wrecks!',
	"I only know 25 letters of the alphabet. I don't know y.",
	'Why did the math book look so sad? Because it had too many problems!',
	"What's the best thing about Switzerland? I don't know, but the flag is a big plus.",
	'I invented a new word: Plagiarism!',
	"Did you hear about the mathematician who's afraid of negative numbers? He'll stop at nothing to avoid them!",
	"Why do we tell actors to 'break a leg?' Because every play has a cast!",
	"I'd tell you a construction joke, but I'm still working on it.",
	'What do you call a belt made of watches? A waist of time!',
	'Why did the cookie go to the doctor? Because it felt crumbly!',
	"What's orange and sounds like a parrot? A carrot!",
	"Why don't oysters share? Because they're shellfish!",
	'What do you call a fish wearing a crown? A king fish!',
	'Why did the golfer wear two pairs of pants? In case he got a hole in one!',
	'What do you call a cow with no legs? Ground beef!',
	"Why don't melons get married? Because they cantaloupe!",
	"What did one wall say to the other? I'll meet you at the corner!",
	"Why did the banana go to the doctor? It wasn't peeling well!",
	'What do you call a sleeping bull? A bulldozer!',
	"What's the difference between a fish and a piano? You can't tuna fish!",
	'Why did the stadium get hot after the game? All the fans left!',
	'What do you call a bear with no teeth? A gummy bear!',
	'What do you call a factory that makes okay products? A satisfactory!',
	'Why did the bicycle fall over? Because it was two-tired!',
	'What do you call a dinosaur that loves to sleep? A dino-snore!',
	'What did the grape say when it got stepped on? Nothing, it just let out a little wine!',
	'Why did the coffee file a police report? It got mugged!',
	'What do you call a pig that does karate? A pork chop!',
	'Why did the tomato turn red? Because it saw the salad dressing!',
	"What's the best way to watch a fly fishing tournament? Live stream!",
	'What do you call a dog magician? A labracadabrador!',
	'What do you call a cow in an earthquake? A milkshake!',
];

let lastJokeIndex = -1;

export function getRandomJoke(): string {
	let randomIndex: number;
	do {
		randomIndex = Math.floor(Math.random() * jokes.length);
	} while (randomIndex === lastJokeIndex && jokes.length > 1);

	lastJokeIndex = randomIndex;
	return (
		jokes[randomIndex] ?? 'Why did the joke fail? Because it was undefined!'
	);
}
