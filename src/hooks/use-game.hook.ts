import { useCallback, useMemo, useRef } from 'react';

import { ORIENTATION, PLAYER } from '@/constants';
import { setHorizontalBoatPosition, setVerticalBoatPosition } from '@/methods';
import { BOARD_BOX_ITEM, CursorPosition, HISTORY, TORIENTATION } from '@/types';
import { randomNumber } from '@/utils';

type Props = {
	setBoxesOver: (arr: number[]) => void;
	items: BOARD_BOX_ITEM[];
};

const useGameHook = ({ setBoxesOver, items }: Props) => {
	const orientation = useRef<TORIENTATION>(ORIENTATION.HORIZONTAL);

	const switchOrientation = useCallback(() => {
		orientation.current =
			orientation.current === ORIENTATION.HORIZONTAL
				? ORIENTATION.VERTICAL
				: ORIENTATION.HORIZONTAL;
	}, [orientation]);

	const setBoatPosition = useCallback(
		({ box, boat }: CursorPosition) => {
			const horizontal = orientation.current === ORIENTATION.HORIZONTAL;
			const vertical = orientation.current === ORIENTATION.VERTICAL;

			let boxes: number[] = [];

			if (horizontal) {
				boxes = setHorizontalBoatPosition(box, boat);
			}

			if (vertical) {
				boxes = setVerticalBoatPosition(box, boat);
			}

			setBoxesOver(boxes);

			return boxes;
		},
		[orientation, setBoxesOver],
	);

	const randomOrientation = () => {
		orientation.current = [ORIENTATION.VERTICAL, ORIENTATION.HORIZONTAL][
			randomNumber(0, 1)
		];
	};

	const history = useMemo<HISTORY[]>(() => {
		return items.filter((item) => {
			const computerShots = item.player[PLAYER.COMPUTER].shot;
			const humanShots = item.player[PLAYER.HUMAN].shot;

			return computerShots || humanShots;
		}).reduce<HISTORY[]>((accumulator, currentItem) => {
			const playerShot = currentItem.player[PLAYER.HUMAN].shot;
			if (playerShot) {
				accumulator.push({
					...currentItem,
					date: playerShot.date,
					value: playerShot.value,
					who: PLAYER.HUMAN,
				});
			}

			const computerShot = currentItem.player[PLAYER.COMPUTER].shot;
			if (computerShot) {
				accumulator.push({
					...currentItem,
					date: computerShot.date,
					value: computerShot.value,
					who: PLAYER.COMPUTER,
				});
			}
			return accumulator;
		}, [])
			.sort((prevItem, nextItem) => prevItem.date > nextItem.date ? - 1 : 1);
	}, [items]);

	return {
		setBoatPosition,
		switchOrientation,
		randomOrientation,
		orientation: orientation.current,
		history,
	};
};

export default useGameHook;
