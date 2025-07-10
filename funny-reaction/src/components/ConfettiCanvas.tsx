import { useCallback, useEffect, useRef } from 'react';

interface ConfettiCanvasProps {
	showConfetti: boolean;
	onConfettiEnd: () => void;
}

const ConfettiCanvas = ({
	showConfetti,
	onConfettiEnd,
}: ConfettiCanvasProps) => {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	const renderConfetti = useCallback(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;

		const particles: Array<{
			x: number;
			y: number;
			vx: number;
			vy: number;
			color: string;
			alpha: number;
		}> = [];

		// Create 20 confetti particles
		const colors = [
			'#ef4444',
			'#f97316',
			'#eab308',
			'#22c55e',
			'#3b82f6',
			'#8b5cf6',
		];
		for (let i = 0; i < 20; i++) {
			particles.push({
				x: Math.random() * canvas.width,
				y: Math.random() * canvas.height * 0.3,
				vx: (Math.random() - 0.5) * 4,
				vy: Math.random() * 2 + 1,
				color: colors[Math.floor(Math.random() * colors.length)],
				alpha: 1,
			});
		}

		const animate = () => {
			ctx.clearRect(0, 0, canvas.width, canvas.height);

			particles.forEach(particle => {
				particle.x += particle.vx;
				particle.y += particle.vy;
				particle.alpha *= 0.995; // Fade out

				ctx.save();
				ctx.globalAlpha = particle.alpha;
				ctx.fillStyle = particle.color;
				ctx.fillRect(particle.x, particle.y, 8, 8);
				ctx.restore();
			});

			if (particles[0].alpha > 0.1) {
				requestAnimationFrame(animate);
			} else {
				onConfettiEnd();
			}
		};

		animate();
	}, [onConfettiEnd]);

	useEffect(() => {
		if (showConfetti) {
			renderConfetti();
		}
	}, [showConfetti, renderConfetti]);

	if (!showConfetti) return null;

	return (
		<canvas
			ref={canvasRef}
			className='fixed inset-0 pointer-events-none z-50'
		/>
	);
};

export default ConfettiCanvas;
