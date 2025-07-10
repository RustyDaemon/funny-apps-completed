import {
	forwardRef,
	useEffect,
	useImperativeHandle,
	useRef,
	useState,
} from 'react';
import { SPINNER_CONFIG } from '../constants';
import type { SpinnerItem, SpinnerState } from '../types';
import { calculateSectionAngle, generateSpinResult } from '../utils/spinner';
import { WinnerPopup } from './ui/WinnerPopup';

interface SpinnerProps {
	items: SpinnerItem[];
	onSpin?: (result: SpinnerItem) => void;
}

export interface SpinnerRef {
	spin: () => void;
	reset: () => void;
	getState: () => SpinnerState;
}

/**
 * Spinner component - renders the animated wheel and handles spinning logic
 */
export const Spinner = forwardRef<SpinnerRef, SpinnerProps>(
	({ items, onSpin }, ref) => {
		const [spinnerState, setSpinnerState] = useState<SpinnerState>({
			isSpinning: false,
			result: null,
			rotation: 0,
		});

		const spinnerRef = useRef<HTMLDivElement>(null);
		const sectionAngle = calculateSectionAngle(items.length);

		// Expose methods to parent component
		useImperativeHandle(ref, () => ({
			spin: handleSpin,
			reset: handleReset,
			getState: () => spinnerState,
		}));

		// Set initial rotation
		useEffect(() => {
			if (spinnerRef.current) {
				spinnerRef.current.style.transform = `rotate(${spinnerState.rotation}deg)`;
			}
		}, [spinnerState.rotation]);

		/**
		 * Resets the spinner to initial state
		 */
		const handleReset = () => {
			setSpinnerState({
				isSpinning: false,
				result: null,
				rotation: 0,
			});

			if (spinnerRef.current) {
				spinnerRef.current.style.transition = 'none';
				spinnerRef.current.style.transform = 'rotate(0deg)';
			}
		};

		/**
		 * Starts the spinning animation
		 */
		const handleSpin = () => {
			if (spinnerState.isSpinning) return;

			const { item, rotation, duration } = generateSpinResult(items);

			setSpinnerState({
				isSpinning: true,
				result: null,
				rotation: spinnerState.rotation + rotation,
			});

			if (spinnerRef.current) {
				spinnerRef.current.style.transition = `transform ${duration}ms cubic-bezier(0.2, 0, 0.1, 1)`;
				spinnerRef.current.style.transform = `rotate(${
					spinnerState.rotation + rotation
				}deg)`;

				const handleTransitionEnd = () => {
					setSpinnerState(prev => ({
						...prev,
						isSpinning: false,
						result: item,
					}));

					onSpin?.(item);

					if (spinnerRef.current) {
						spinnerRef.current.removeEventListener(
							'transitionend',
							handleTransitionEnd
						);
					}
				};

				spinnerRef.current.removeEventListener(
					'transitionend',
					handleTransitionEnd
				);
				spinnerRef.current.addEventListener(
					'transitionend',
					handleTransitionEnd
				);
			}
		};

		/**
		 * Creates SVG path for a spinner section
		 */
		const createSectionPath = (index: number) => {
			const startAngle = index * sectionAngle;
			const endAngle = (index + 1) * sectionAngle;
			const radius = SPINNER_CONFIG.WHEEL_RADIUS;
			const centerX = SPINNER_CONFIG.CENTER_X;
			const centerY = SPINNER_CONFIG.CENTER_Y;

			const startAngleRad = (startAngle * Math.PI) / 180;
			const endAngleRad = (endAngle * Math.PI) / 180;

			const x1 = centerX + radius * Math.cos(startAngleRad);
			const y1 = centerY + radius * Math.sin(startAngleRad);
			const x2 = centerX + radius * Math.cos(endAngleRad);
			const y2 = centerY + radius * Math.sin(endAngleRad);

			const largeArc = sectionAngle > 180 ? 1 : 0;

			return `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;
		};

		return (
			<div className='w-full h-full relative'>
				{/* Spinner wheel - fills entire space */}
				<div className='absolute inset-0 flex items-center justify-center'>
					{/* Prevent interaction while spinning */}
					{spinnerState.isSpinning && (
						<div className='absolute inset-0 z-10 pointer-events-auto cursor-not-allowed' />
					)}

					<div
						ref={spinnerRef}
						className={`w-full h-full max-w-full max-h-full aspect-square spinner-wheel ${
							spinnerState.isSpinning ? '' : 'no-transition'
						}`}
						data-rotation={spinnerState.rotation}
					>
						<svg
							viewBox={`0 0 ${SPINNER_CONFIG.VIEWBOX_SIZE} ${SPINNER_CONFIG.VIEWBOX_SIZE}`}
							className='w-full h-full drop-shadow-xl pointer-events-none'
						>
							{items.map((item, index) => {
								const textAngle =
									(index * sectionAngle + sectionAngle / 2) * (Math.PI / 180);
								const textRadius = SPINNER_CONFIG.TEXT_RADIUS;
								const textX =
									SPINNER_CONFIG.CENTER_X + textRadius * Math.cos(textAngle);
								const textY =
									SPINNER_CONFIG.CENTER_Y + textRadius * Math.sin(textAngle);

								const isWinner =
									spinnerState.result && spinnerState.result.id === item.id;
								const hasResult =
									spinnerState.result && !spinnerState.isSpinning;

								return (
									<g key={item.id}>
										<path
											d={createSectionPath(index)}
											fill={item.color}
											stroke='#ffffff'
											strokeWidth='3'
											className={`spinner-section ${
												hasResult && !isWinner ? 'grayscale opacity-50' : ''
											} ${isWinner ? 'drop-shadow-lg' : ''}`}
										/>

										<text
											x={textX}
											y={textY}
											textAnchor='middle'
											dominantBaseline='middle'
											className={`fill-white font-semibold text-xs sm:text-sm pointer-events-none ${
												hasResult && !isWinner ? 'opacity-50' : ''
											} ${isWinner ? 'font-bold text-sm sm:text-base' : ''}`}
											transform={`rotate(${
												index * sectionAngle + sectionAngle / 2
											}, ${textX}, ${textY})`}
										>
											{item.text.length > 10
												? `${item.text.substring(0, 8)}...`
												: item.text}
										</text>
									</g>
								);
							})}

							{/* Center circle */}
							<circle
								cx={SPINNER_CONFIG.CENTER_X}
								cy={SPINNER_CONFIG.CENTER_Y}
								r={SPINNER_CONFIG.CENTER_RADIUS}
								fill='#1f2937'
								stroke='#ffffff'
								strokeWidth='4'
								className='drop-shadow-lg'
							/>
						</svg>
					</div>

					{/* Winner popup */}
					{spinnerState.result && (
						<WinnerPopup
							winner={spinnerState.result}
							isVisible={!spinnerState.isSpinning}
						/>
					)}
				</div>
			</div>
		);
	}
);
