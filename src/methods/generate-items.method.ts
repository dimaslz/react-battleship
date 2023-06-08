import { BOARD_SIZE, LETTERS, PLAYER } from '@/constants';
import { BOARD_BOX_ITEM } from '@/types';

import { createArray } from '.';

const generateItems = (): BOARD_BOX_ITEM[] => {
	let row = 0;
	return createArray(BOARD_SIZE * BOARD_SIZE).map((_, index) => {
		if (index % BOARD_SIZE === 0) {
			row++;
		}

		const col = (index % BOARD_SIZE) + 1;

		return {
			box: index + 1,
			col,
			row,
			label: `${LETTERS[col - 1]}${row}`,
			over: false,
			player: {
				[PLAYER.HUMAN]: {
					filled: false,
					shot: null,
				},
				[PLAYER.COMPUTER]: {
					filled: false,
					shot: null,
				},
			},
		};
	});
};

export default generateItems;
