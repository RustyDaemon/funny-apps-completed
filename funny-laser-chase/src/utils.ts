import type { Position, Velocity } from './types';

export const getDistance = (pos1: Position, pos2: Position): number => {
	const dx = pos1.x - pos2.x;
	const dy = pos1.y - pos2.y;
	return Math.sqrt(dx * dx + dy * dy);
};

export const getRandomVelocity = (): Velocity => {
	const speed = 50 + Math.random() * 100; // 50-150 px/s
	const angle = Math.random() * 2 * Math.PI;
	return {
		x: Math.cos(angle) * speed,
		y: Math.sin(angle) * speed,
	};
};

export const predictLaserPosition = (
	currentPos: Position,
	velocity: Velocity,
	timeAhead: number
): Position => {
	return {
		x: currentPos.x + velocity.x * timeAhead,
		y: currentPos.y + velocity.y * timeAhead,
	};
};

export const generateId = (): string => {
	return `cat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const createConfetti = (
	x: number,
	y: number,
	windowElement?: HTMLElement
): void => {
	const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7'];
	const particles = 12;

	// Get the window container's position
	const container = windowElement || document.body;
	const rect = container.getBoundingClientRect();
	const absoluteX = rect.left + x;
	const absoluteY = rect.top + y;

	for (let i = 0; i < particles; i++) {
		const particle = document.createElement('div');
		particle.className = 'confetti-particle';
		particle.style.position = 'fixed';
		particle.style.left = `${absoluteX}px`;
		particle.style.top = `${absoluteY}px`;
		particle.style.width = '6px';
		particle.style.height = '6px';
		particle.style.backgroundColor =
			colors[Math.floor(Math.random() * colors.length)];
		particle.style.borderRadius = '50%';
		particle.style.pointerEvents = 'none';
		particle.style.zIndex = '1000';

		document.body.appendChild(particle);

		const angle = (i / particles) * 2 * Math.PI;
		const velocity = 100 + Math.random() * 100;
		const vx = Math.cos(angle) * velocity;
		const vy = Math.sin(angle) * velocity;

		let posX = absoluteX;
		let posY = absoluteY;
		let opacity = 1;
		let gravity = 300;
		let velocityY = vy;

		const animate = () => {
			posX += vx * 0.016;
			velocityY += gravity * 0.016;
			posY += velocityY * 0.016;
			opacity -= 0.02;

			particle.style.left = `${posX}px`;
			particle.style.top = `${posY}px`;
			particle.style.opacity = opacity.toString();

			if (opacity > 0) {
				requestAnimationFrame(animate);
			} else {
				if (document.body.contains(particle)) {
					document.body.removeChild(particle);
				}
			}
		};

		requestAnimationFrame(animate);
	}
};
