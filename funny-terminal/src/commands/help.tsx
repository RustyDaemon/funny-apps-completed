import { CommandContext } from '../types';

export const help = async (context: CommandContext): Promise<void> => {
	const { addOutput } = context;

	const helpText = `
Available Commands:
┌                                                                                                       
│  brew coffee              Brew coffee              
│                                                                             
│  hack-time                Dramatic hacking sequence
│                                                                             
│  weather mars             Get fake Mars weather forecast                     
│                                                                             
│  motivate                 Rotate inspirational quotes                          
│                                                                             
│  matrix                   Enter the Matrix with falling characters                              
│                                  
│  mine                     Start cryptocurrency mining                     
│                                                                             
│  fortune                  Get your fortune told by the digital spirits
│                                                                             
│  zombie                   Survive the zombie apocalypse simulation        
│                                                                                               
│  clear                    Clear the terminal screen                        
└
  `;

	addOutput(
		<pre className='text-emerald-400 my-2 text-xs sm:text-sm overflow-x-auto whitespace-pre'>
			{helpText}
		</pre>
	);
};

export const clear = async (context: CommandContext): Promise<void> => {
	const { clearOutput } = context;
	clearOutput();
};
