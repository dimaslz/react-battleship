import { BOAT, TORIENTATION, TPLAYER_TYPE, TSHOT_VALUE } from '@/types';

export const BOARD_SIZE = 10;
export const LETTERS = 'ABCDEFGHIJ';

export const BOATS: BOAT[] = [
	{
		label: 'Battleship',
		squares: 5,
	},
	{
		label: 'Destroyer',
		squares: 4,
	},
	{
		label: 'Destroyer',
		squares: 4,
	},
];

export const ORIENTATION: { [K in Uppercase<TORIENTATION>]: TORIENTATION } = {
	VERTICAL: 'vertical',
	HORIZONTAL: 'horizontal',
};

export const PLAYER: { [K in Uppercase<TPLAYER_TYPE>]: TPLAYER_TYPE } = {
	HUMAN: 'human',
	COMPUTER: 'computer',
};

export const SHOT_VALUE: { [K in Uppercase<TSHOT_VALUE>]: TSHOT_VALUE } = {
	TOUCH: 'touch',
	WATER: 'water',
};

export const MAX_SCORES = BOATS.map((boat) => boat.squares).reduce(
	(a, b) => a + b,
	0,
);
