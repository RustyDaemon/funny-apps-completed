import { CommandContext } from '../types';

export const fortuneTeller = async (context: CommandContext): Promise<void> => {
	const { addOutput } = context;

	const fortunes = [
		{
			category: '🔮 Mystical Prediction',
			message: 'A bug in your code will reveal itself at 3:33 AM.',
			advice: 'Keep a rubber duck nearby for deep conversations.',
		},
		{
			category: '💰 Financial Forecast',
			message: 'Your cryptocurrency portfolio will fluctuate like your mood.',
			advice: 'Invest in coffee beans - they always retain their value.',
		},
		{
			category: '❤️ Love & Relationships',
			message: 'Your computer will fall in love with a new operating system.',
			advice: 'Update your antivirus - trust issues are common in tech.',
		},
		{
			category: '🎯 Career Guidance',
			message: 'Stack Overflow will become your best friend this week.',
			advice: 'Remember: Ctrl+C, Ctrl+V is not a programming language.',
		},
		{
			category: '🌟 Cosmic Wisdom',
			message: 'The universe is made of code, and yours has a syntax error.',
			advice: 'Seek the wisdom of the rubber duck debugger.',
		},
		{
			category: '🍀 Lucky Numbers',
			message: 'Your lucky numbers are: 404, 503, and 418.',
			advice: "Use them wisely, especially 418 - it's a teapot!",
		},
	];

	const selectedFortune = fortunes[Math.floor(Math.random() * fortunes.length)];

	const fortuneCard = `
🔮 Fortune Teller Terminal 🔮

┌
│ ${selectedFortune.category}
│ 
│ ${selectedFortune.message}
│ 
│ 💡 Advice: ${selectedFortune.advice}
│ 
│ ⭐ Confidence Level: ${Math.floor(Math.random() * 30 + 70)}%
└

🌙 The digital spirits have spoken... 🌙
  `;

	addOutput(<pre className='text-purple-400 my-2'>{fortuneCard}</pre>);
};
