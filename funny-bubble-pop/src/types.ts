export interface BubbleGrid {
	rows: number;
	cols: number;
	bubbles: boolean[][];
}

export interface ConfettiParticle {
	x: number;
	y: number;
	vx: number;
	vy: number;
	life: number;
	color: string;
}
