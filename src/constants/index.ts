import { BOAT, TORIENTATION, TPLAYER_TYPE, TSHOT_VALUE } from '../types';

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

export const ORIENTATION: { [key: string]: TORIENTATION } = {
	VERTICAL: 'vertical',
	HORIZONTAL: 'horizontal',
};

export const PLAYER: { [key: string]: TPLAYER_TYPE } = {
	HUMAN: 'human',
	COMPUTER: 'computer',
};

export const SHOT_VALUE: { [key: string]: TSHOT_VALUE } = {
	TOUCH: 'touch',
	WATER: 'water',
};
