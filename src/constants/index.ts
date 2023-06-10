import { Boat, Orientation, Player, Shot } from '@/types';

export const BOARD_SIZE = 10;
export const LETTERS = 'ABCDEFGHIJ';

export const BOATS: Boat[] = [
	{
		id: crypto.randomUUID(),
		label: 'Battleship',
		length: 5,
	},
	{
		id: crypto.randomUUID(),
		label: 'Destroyer',
		length: 4,
	},
	{
		id: crypto.randomUUID(),
		label: 'Destroyer',
		length: 4,
	},
];

export const ORIENTATION: { [K in Uppercase<Orientation>]: Orientation } = {
	VERTICAL: 'vertical',
	HORIZONTAL: 'horizontal',
};

export const PLAYER: { [K in Uppercase<Player>]: Player } = {
	HUMAN: 'human',
	COMPUTER: 'computer',
};

export const SHOT_VALUE: { [K in Uppercase<Shot>]: Shot } = {
	TOUCH: 'touch',
	WATER: 'water',
};

export const MAX_SCORES = BOATS.map((boat) => boat.length).reduce(
	(a, b) => a + b,
	0,
);
