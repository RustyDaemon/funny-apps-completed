import type { ConfettiParticle } from './types';

const CONFETTI_COLORS = [
	'#ff6b6b',
	'#4ecdc4',
	'#45b7d1',
	'#96ceb4',
	'#ffeaa7',
	'#dda0dd',
	'#ff9ff3',
	'#54a0ff',
	'#5f27cd',
	'#00d2d3',
	'#ff9f43',
	'#2ed573',
	'#ff6b6b',
	'#ffa502',
	'#3742fa',
	'#2f3542',
];

export const createConfetti = (x: number, y: number): ConfettiParticle[] => {
	return Array.from({ length: 10 }, () => ({
		x,
		y,
		vx: (Math.random() - 0.5) * 8,
		vy: (Math.random() - 0.5) * 8 - 2,
		life: 1,
		color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
	}));
};

export const updateConfetti = (
	particles: ConfettiParticle[]
): ConfettiParticle[] => {
	return particles
		.map(particle => ({
			...particle,
			x: particle.x + particle.vx,
			y: particle.y + particle.vy,
			vy: particle.vy + 0.3, // gravity
			life: particle.life - 0.02,
		}))
		.filter(particle => particle.life > 0);
};

export const drawConfetti = (
	ctx: CanvasRenderingContext2D,
	particles: ConfettiParticle[]
) => {
	ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

	particles.forEach(particle => {
		ctx.save();
		ctx.globalAlpha = particle.life;
		ctx.fillStyle = particle.color;
		ctx.fillRect(particle.x - 2, particle.y - 2, 4, 4);
		ctx.restore();
	});
};
