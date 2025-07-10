export type DiceType = 3 | 6 | 12 | 20;

export interface RollResult {
	id: string;
	diceType: DiceType;
	result: number;
	timestamp: Date;
}
