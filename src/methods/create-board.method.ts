import { BOARD_SIZE } from '../constants';
import { BOARD_BOX_ITEM, BOARD_ROW } from '../types';

const createBoard = (items: BOARD_BOX_ITEM[]): BOARD_ROW[] => {
	let cols: BOARD_BOX_ITEM[] = [];
	return items.reduce((row: BOARD_ROW[], item: BOARD_BOX_ITEM) => {
		if (item.col % BOARD_SIZE === 0) {
			cols.push(item);
			row.push(cols);

			cols = [];
		} else {
			cols.push(item);
		}

		return row;
	}, []);
};

export default createBoard;
