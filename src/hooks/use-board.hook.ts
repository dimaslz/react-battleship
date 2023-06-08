import { useMemo, useState } from 'react';

import { MAX_SCORES, PLAYER, SHOT_VALUE } from '@/constants';
import { createBoard } from '@/methods';
import { BOARD_BOX_ITEM, TPLAYER_TYPE } from '@/types';

const useBoard = (initialItems: BOARD_BOX_ITEM[]) => {
	const [items, updateItems] = useState<BOARD_BOX_ITEM[]>(initialItems);
	const [turn, setTurn] = useState<TPLAYER_TYPE | null>(null);

	const board = useMemo(() => {
		return createBoard(items);
	}, [items]);

	const humanScores = useMemo(() => {
		return items.filter((item) => {
			return item.player[PLAYER.HUMAN].shot?.value === SHOT_VALUE.TOUCH;
		}).length;
	}, [items]);

	const computerScores = useMemo(() => {
		return items.filter((item) => {
			return item.player[PLAYER.COMPUTER].shot?.value === SHOT_VALUE.TOUCH;
		}).length;
	}, [items]);

	const computerWins = useMemo(() => {
		return computerScores === MAX_SCORES;
	}, [computerScores]);

	const humanWins = useMemo(() => {
		return humanScores === MAX_SCORES;
	}, [humanScores]);

	return {
		turn,
		setTurn,
		items,
		updateItems,
		board,
		scores: {
			human: humanScores,
			computer: computerScores,
		},
		maxScores: MAX_SCORES,
		computerWins,
		humanWins,
	};
};

export default useBoard;
