import { motion } from 'framer-motion';
import { useEffect, useMemo, useRef } from 'react';

interface SentenceDisplayProps {
	text: string;
	typedText: string;
	isActive: boolean;
}

interface CharacterProps {
	char: string;
	status: 'correct' | 'incorrect' | 'untyped' | 'current';
	index: number;
}

function Character({ char, status, index }: CharacterProps) {
	const getCharacterStyle = () => {
		switch (status) {
			case 'correct':
				return 'text-green-400 bg-green-400/20';
			case 'incorrect':
				return 'text-red-400 bg-red-400/30 font-bold';
			case 'current':
				return 'text-white bg-blue-500/40 animate-pulse border border-blue-400 rounded-sm';
			default:
				return 'text-gray-400';
		}
	};

	return (
		<motion.span
			key={`${index}-${char}`}
			initial={{ opacity: 0.5 }}
			animate={{ opacity: 1 }}
			className={`${getCharacterStyle()} px-0.5 py-0.5 transition-all duration-100`}
		>
			{char === ' ' ? '\u00A0' : char}
		</motion.span>
	);
}

export function SentenceDisplay({
	text,
	typedText,
	isActive,
}: SentenceDisplayProps) {
	const scrollRef = useRef<HTMLDivElement>(null);

	const renderedCharacters = useMemo(() => {
		if (!text) return [];

		return text.split('').map((char, index) => {
			let status: 'correct' | 'incorrect' | 'untyped' | 'current';

			if (index < typedText.length) {
				status = typedText[index] === char ? 'correct' : 'incorrect';
			} else if (index === typedText.length && isActive) {
				status = 'current';
			} else {
				status = 'untyped';
			}

			return (
				<Character key={index} char={char} status={status} index={index} />
			);
		});
	}, [text, typedText, isActive]);

	// Auto-scroll to keep current position visible - Improved scrolling
	useEffect(() => {
		if (scrollRef.current && typedText.length > 0) {
			const container = scrollRef.current;
			const currentChar = container.children[typedText.length] as HTMLElement;

			if (currentChar) {
				const containerRect = container.getBoundingClientRect();
				const charRect = currentChar.getBoundingClientRect();

				// Check if current character is near the bottom of the visible area
				if (charRect.bottom > containerRect.bottom - 40) {
					currentChar.scrollIntoView({
						behavior: 'smooth',
						block: 'center',
						inline: 'nearest',
					});
				}
			}
		}
	}, [typedText.length]);

	return (
		<div className='bg-gray-900/50 rounded-lg p-6 mb-6 max-w-4xl mx-auto'>
			<div
				ref={scrollRef}
				className='text-lg md:text-xl leading-relaxed font-mono tracking-wide break-words min-h-[140px] max-h-[200px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800 smooth-scroll border-2 border-gray-700/50 rounded p-4 bg-gray-800/30'
			>
				{renderedCharacters}
			</div>
			<div className='text-center mt-4 text-gray-500 text-sm'>
				{isActive ? 'Keep typing...' : 'Text will appear here'}
			</div>
		</div>
	);
}
