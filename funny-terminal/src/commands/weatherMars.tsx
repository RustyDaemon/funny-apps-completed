import { CommandContext } from '../types';

export const weatherMars = async (context: CommandContext): Promise<void> => {
	const { addOutput } = context;

	const forecasts = [
		{
			high: -15,
			low: -87,
			dustStorm: 23,
			remark: 'Perfect weather for a rover picnic! 🤖',
		},
		{
			high: -8,
			low: -92,
			dustStorm: 67,
			remark: 'Dust storm incoming! Time to hibernate. 😴',
		},
		{
			high: -22,
			low: -78,
			dustStorm: 12,
			remark: 'Clear skies ahead - great for stargazing! ✨',
		},
		{
			high: -5,
			low: -95,
			dustStorm: 89,
			remark: 'Martian monsoon season is here! 🌪️',
		},
		{
			high: -18,
			low: -85,
			dustStorm: 34,
			remark: 'Ideal conditions for potato farming! 🥔',
		},
	];

	const forecast = forecasts[Math.floor(Math.random() * forecasts.length)];

	const weatherReport = `
🚀 Mars Weather Station - Sol 1247 🚀

┌
│  Temperature                        
│  High: ${forecast.high}°C (${Math.round(
		(forecast.high * 9) / 5 + 32
	)}°F)          
│  Low:  ${forecast.low}°C (${Math.round(
		(forecast.low * 9) / 5 + 32
	)}°F)          
│                                     
│  Atmospheric Conditions             
│  Pressure: 0.6 kPa                  
│  Dust Storm Chance: ${forecast.dustStorm}%         
│  Wind: 15 m/s (Westerly)            
│                                     
│  Today's Forecast:                  
│  ${forecast.remark}                 
└

🔴 Remember: Don't forget your spacesuit!
  `;

	addOutput(<pre className='text-red-400 my-2'>{weatherReport}</pre>);
};
