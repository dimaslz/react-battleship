import { useMemo, useState } from 'react';

import { createBoard } from '../methods';
import { BOARD_BOX_ITEM } from '../types';

const useBoard = (initialItems: BOARD_BOX_ITEM[]) => {
	const [items, updateItems] = useState<BOARD_BOX_ITEM[]>(initialItems);

	const board = useMemo(() => {
		return createBoard(items);
	}, [items]);

	return {
		items,
		updateItems,
		board,
	};
};

export default useBoard;
