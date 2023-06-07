import { useMemo, useState } from "react";
import { BOARD_BOX_ITEM } from "../types";
import { createBoard, generateItems } from "../methods";

const useBoard = (initialItems: BOARD_BOX_ITEM[]) => {
	const [items, updateItems] = useState<BOARD_BOX_ITEM[]>(initialItems);

	const board = useMemo(() => {
		return createBoard(items);
	}, [items])

	return {
		items,
		updateItems,
		board
	}
}

export default useBoard;
