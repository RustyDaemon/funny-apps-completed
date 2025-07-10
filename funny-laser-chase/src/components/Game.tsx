import { AnimatePresence } from 'framer-motion';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import type { Cat as CatType, GameState, Position } from '../types';
import {
	createConfetti,
	generateId,
	getDistance,
	getRandomVelocity,
	predictLaserPosition,
} from '../utils';
import { Cat } from './Cat';
import { Laser } from './Laser';
import { Scoreboard } from './Scoreboard';
import { Window } from './Window';

const WINDOW_WIDTH = window.innerWidth - 32; // Full width minus padding
const WINDOW_HEIGHT = window.innerHeight - 64; // Full height minus padding and title bar
const LASER_SIZE = 14;
const CATCH_DISTANCE = 30;
const VELOCITY_CHANGE_INTERVAL = 1600;
const PREDICTION_TIME = 0.5;
const MAX_CATS = 99;

export const Game: React.FC = () => {
	const windowRef = useRef<HTMLDivElement>(null);
	const [gameState, setGameState] = useState<GameState>(() => ({
		cats: [],
		catches: 0,
		laserPosition: { x: WINDOW_WIDTH / 2, y: WINDOW_HEIGHT / 2 },
		laserVelocity: getRandomVelocity(),
		windowBounds: { width: WINDOW_WIDTH, height: WINDOW_HEIGHT },
		soundEnabled: false,
	}));

	const animationFrameRef = useRef<number>(0);
	const lastTimeRef = useRef<number>(0);
	const velocityChangeTimerRef = useRef<number>(0);

	// Laser movement and collision detection
	const updateGame = useCallback((currentTime: number) => {
		const deltaTime = (currentTime - lastTimeRef.current) / 1000;
		lastTimeRef.current = currentTime;
		setGameState(prevState => {
			const { laserPosition, laserVelocity, windowBounds, cats } = prevState;

			// Update laser position
			let newPosition = {
				x: laserPosition.x + laserVelocity.x * deltaTime,
				y: laserPosition.y + laserVelocity.y * deltaTime,
			};

			let newVelocity = { ...laserVelocity };

			// Update cats' current positions (interpolate between start and target)
			const updatedCats = cats.map(cat => {
				const timeSinceSpawn = currentTime - cat.spawnTime;
				const progress = Math.min(timeSinceSpawn / 800, 1); // 800ms animation duration

				const currentX =
					cat.position.x + (cat.targetPosition.x - cat.position.x) * progress;
				const currentY =
					cat.position.y + (cat.targetPosition.y - cat.position.y) * progress;

				return {
					...cat,
					currentPosition: { x: currentX, y: currentY },
				};
			});

			// Bounce off walls
			if (
				newPosition.x <= LASER_SIZE / 2 ||
				newPosition.x >= windowBounds.width - LASER_SIZE / 2
			) {
				newVelocity.x = -newVelocity.x;
				newPosition.x = Math.max(
					LASER_SIZE / 2,
					Math.min(windowBounds.width - LASER_SIZE / 2, newPosition.x)
				);
			}

			if (
				newPosition.y <= LASER_SIZE / 2 ||
				newPosition.y >= windowBounds.height - LASER_SIZE / 2
			) {
				newVelocity.y = -newVelocity.y;
				newPosition.y = Math.max(
					LASER_SIZE / 2,
					Math.min(windowBounds.height - LASER_SIZE / 2, newPosition.y)
				);
			}

			// Check for collisions with cats
			const { caughtCats, remainingCats } = updatedCats.reduce(
				(acc, cat) => {
					const distance = getDistance(cat.currentPosition, newPosition);
					if (distance <= CATCH_DISTANCE) {
						acc.caughtCats.push(cat);
					} else {
						acc.remainingCats.push(cat);
					}
					return acc;
				},
				{ caughtCats: [] as CatType[], remainingCats: [] as CatType[] }
			);

			// Handle caught cats
			if (caughtCats.length > 0) {
				caughtCats.forEach(cat => {
					createConfetti(
						cat.currentPosition.x,
						cat.currentPosition.y,
						windowRef.current || undefined
					);
				});
			}

			return {
				...prevState,
				laserPosition: newPosition,
				laserVelocity: newVelocity,
				cats: remainingCats,
				catches: prevState.catches + caughtCats.length,
			};
		});

		animationFrameRef.current = requestAnimationFrame(updateGame);
	}, []);

	// Start game loop
	useEffect(() => {
		lastTimeRef.current = performance.now();
		animationFrameRef.current = requestAnimationFrame(updateGame);

		return () => {
			if (animationFrameRef.current) {
				cancelAnimationFrame(animationFrameRef.current);
			}
		};
	}, [updateGame]);

	// Change laser velocity periodically
	useEffect(() => {
		const changeVelocity = () => {
			setGameState(prevState => ({
				...prevState,
				laserVelocity: getRandomVelocity(),
			}));
		};

		velocityChangeTimerRef.current = window.setInterval(
			changeVelocity,
			VELOCITY_CHANGE_INTERVAL
		);

		return () => {
			if (velocityChangeTimerRef.current) {
				clearInterval(velocityChangeTimerRef.current);
			}
		};
	}, []);

	// Update window bounds when window size changes
	useEffect(() => {
		const updateWindowBounds = () => {
			if (windowRef.current) {
				const contentArea = windowRef.current.querySelector('.game-content');
				if (contentArea) {
					const rect = contentArea.getBoundingClientRect();
					setGameState(prevState => ({
						...prevState,
						windowBounds: { width: rect.width, height: rect.height },
					}));
				}
			}
		};

		// Initial update
		setTimeout(updateWindowBounds, 500);

		// Listen for window resize
		window.addEventListener('resize', updateWindowBounds);
		return () => window.removeEventListener('resize', updateWindowBounds);
	}, []);

	// Handle cat spawning
	const handleSpawnCat = useCallback(
		(event: React.PointerEvent) => {
			// Check if we've reached the max cats limit
			if (gameState.cats.length >= MAX_CATS) {
				return;
			}

			const rect = event.currentTarget.getBoundingClientRect();
			const clickPosition: Position = {
				x: event.clientX - rect.left,
				y: event.clientY - rect.top,
			};

			const predictedLaserPosition = predictLaserPosition(
				gameState.laserPosition,
				gameState.laserVelocity,
				PREDICTION_TIME
			);

			const currentTime = performance.now();
			const newCat: CatType = {
				id: generateId(),
				position: clickPosition,
				currentPosition: clickPosition,
				targetPosition: predictedLaserPosition,
				spawnTime: currentTime,
				isChasing: true,
			};

			setGameState(prevState => ({
				...prevState,
				cats: [...prevState.cats, newCat],
			}));
		},
		[gameState.cats.length, gameState.laserPosition, gameState.laserVelocity]
	);

	// Handle cat removal
	const handleCatComplete = useCallback((catId: string) => {
		setGameState(prevState => ({
			...prevState,
			cats: prevState.cats.filter(cat => cat.id !== catId),
		}));
	}, []);

	// Handle reset
	const handleReset = useCallback(() => {
		setGameState(prevState => ({
			...prevState,
			cats: [],
			catches: 0,
			laserPosition: { x: WINDOW_WIDTH / 2, y: WINDOW_HEIGHT / 2 },
			laserVelocity: getRandomVelocity(),
		}));
	}, []);

	// Keyboard shortcuts
	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			switch (event.key.toLowerCase()) {
			}
		};

		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, [handleReset]);

	return (
		<Window
			ref={windowRef}
			className='w-full h-full'
			onPointerDown={handleSpawnCat}
		>
			<div className='w-full h-full relative bg-slate-900'>
				<Scoreboard catches={gameState.catches} onReset={handleReset} />

				<Laser position={gameState.laserPosition} />

				<AnimatePresence mode='popLayout'>
					{gameState.cats.map(cat => (
						<Cat
							key={cat.id}
							cat={cat}
							onAnimationComplete={() => handleCatComplete(cat.id)}
						/>
					))}
				</AnimatePresence>
			</div>
		</Window>
	);
};
