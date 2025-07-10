export const funnyResponses = [
	{
		text: 'Absolutely! Buy it NOW before someone else does!',
		emoji: '🔥',
	},
	{
		text: 'Hmm, your bank account says no, but I say YES!',
		emoji: '💰',
	},
	{
		text: 'Do it! Future you can deal with the consequences.',
		emoji: '🤷‍♂️',
	},
	{
		text: 'Is it shiny? If yes, then definitely buy it!',
		emoji: '✨',
	},
	{
		text: 'The stars have aligned... your purchase is cosmically approved!',
		emoji: '🌟',
	},
	{
		text: 'Wait until tomorrow... and then BUY IT ANYWAY!',
		emoji: '🤣',
	},
	{
		text: 'Your shopping cart is looking too empty. Fix that!',
		emoji: '🛒',
	},
	{
		text: 'Sorry, I was distracted. What? Oh, just buy it!',
		emoji: '😅',
	},
	{
		text: 'Maybe save your money... JUST KIDDING! Buy it!',
		emoji: '💸',
	},
	{
		text: "You've resisted for too long. Treat yourself!",
		emoji: '🎁',
	},
	{
		text: "I calculated the cost per use and it's practically free!",
		emoji: '🧮',
	},
	{
		text: 'Buy now, regret never! Or maybe tomorrow...',
		emoji: '😈',
	},
	{
		text: "Don't buy it. Oh wait, reverse psychology! BUY IT!",
		emoji: '🔄',
	},
	{
		text: 'Life is short. The shopping cart is waiting.',
		emoji: '⏳',
	},
	{
		text: 'Will it make you happy for 5 minutes? Worth it!',
		emoji: '⚡',
	},
];

export const getRandomResponse = () => {
	const randomIndex = Math.floor(Math.random() * funnyResponses.length);
	return funnyResponses[randomIndex];
};
