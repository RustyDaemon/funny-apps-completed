import { motion } from 'framer-motion';
import React, { useCallback, useRef } from 'react';

interface WindowProps {
	children: React.ReactNode;
	onPointerDown: (event: React.PointerEvent) => void;
	className?: string;
	ref?: React.RefObject<HTMLDivElement>;
}

export const Window = React.forwardRef<HTMLDivElement, WindowProps>(
	({ children, onPointerDown, className = '' }, ref) => {
		const windowRef = useRef<HTMLDivElement>(null);

		// Combine internal ref with forwarded ref
		const combinedRef = useCallback(
			(node: HTMLDivElement) => {
				windowRef.current = node;
				if (typeof ref === 'function') {
					ref(node);
				} else if (ref) {
					ref.current = node;
				}
			},
			[ref]
		);

		const TrafficLight: React.FC<{ color: string }> = ({ color }) => (
			<div className={`w-3.5 h-3.5 rounded-full cursor-pointer ${color}`} />
		);

		return (
			<motion.div
				ref={combinedRef}
				className={`bg-gray-800 rounded-xl shadow-2xl border border-gray-600 overflow-hidden fullscreen-window cursor-default ${className}`}
				initial={{ scale: 0.95, opacity: 0 }}
				animate={{ scale: 1, opacity: 1 }}
				transition={{ duration: 0.3 }}
			>
				{/* Title Bar */}
				<div className='bg-gray-700 h-10 flex items-center px-5 cursor-move select-none border-b border-gray-600'>
					{/* Traffic Light Buttons */}
					<div className='flex space-x-2.5 items-center'>
						<TrafficLight color='bg-red-500 hover:bg-red-400 transition-colors' />
						<TrafficLight color='bg-yellow-500 hover:bg-yellow-400 transition-colors' />
						<TrafficLight color='bg-green-500 hover:bg-green-400 transition-colors' />
					</div>
					<div className='flex-1 text-center text-gray-200 text-sm font-medium'>
						Funny Laser Chase • Click to spawn cats
					</div>
				</div>

				{/* Content Area */}
				<div
					className='relative bg-slate-900 overflow-hidden game-content h-[calc(100vh-4.5rem)]'
					onPointerDown={onPointerDown}
				>
					{children}
				</div>
			</motion.div>
		);
	}
);

Window.displayName = 'Window';
