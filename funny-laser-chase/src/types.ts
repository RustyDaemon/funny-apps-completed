export interface Position {
	x: number;
	y: number;
}

export interface Velocity {
	x: number;
	y: number;
}

export interface Cat {
	id: string;
	position: Position;
	targetPosition: Position;
	currentPosition: Position;
	spawnTime: number;
	isChasing: boolean;
}

export interface WindowBounds {
	width: number;
	height: number;
}

export interface GameState {
	cats: Cat[];
	catches: number;
	laserPosition: Position;
	laserVelocity: Velocity;
	windowBounds: WindowBounds;
}
