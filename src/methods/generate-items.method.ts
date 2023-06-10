import { BOARD_SIZE, LETTERS } from '@/constants';
import { BoardBoxItem } from '@/types';

import { createArray } from '.';

const generateItems = (): BoardBoxItem[] => {
	let row = 0;
	return createArray(BOARD_SIZE * BOARD_SIZE).map((_, index): BoardBoxItem => {
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
				"human": {
					filled: null,
					shot: null,
				},
				"computer": {
					filled: null,
					shot: null,
				},
			},
		};
	});
};

export default generateItems;
