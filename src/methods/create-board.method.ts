import { BOARD_SIZE } from '@/constants';
import { BoardBoxItem, BoardRow } from '@/types';

const createBoard = (items: BoardBoxItem[]): BoardRow[] => {
	let cols: BoardBoxItem[] = [];
	return items.reduce((row: BoardRow[], item: BoardBoxItem) => {
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
