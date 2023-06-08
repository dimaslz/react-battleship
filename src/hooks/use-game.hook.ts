import { useCallback, useRef } from 'react';

import { ORIENTATION } from '../constants';
import { setHorizontalBoatPosition, setVerticalBoatPosition } from '../methods';
import { BOARD_BOX_ITEM, TORIENTATION } from '../types';
import { randomNumber } from '../utils';

type Props = {
	setBoxesOver: (arr: number[]) => void;
	updateItems: React.Dispatch<React.SetStateAction<BOARD_BOX_ITEM[]>>;
};

const useGameHook = ({ setBoxesOver, updateItems }: Props) => {
	const orientation = useRef<TORIENTATION>(ORIENTATION.HORIZONTAL);

	const switchOrientation = useCallback(() => {
		orientation.current =
			orientation.current === ORIENTATION.HORIZONTAL
				? ORIENTATION.VERTICAL
				: ORIENTATION.HORIZONTAL;
	}, [orientation]);

	const setBoatPosition = useCallback(
		({ box, row, boat }: any) => {
			const horizontal = orientation.current === ORIENTATION.HORIZONTAL;
			const vertical = orientation.current === ORIENTATION.VERTICAL;

			let boxes: number[] = [];

			if (horizontal) {
				boxes = setHorizontalBoatPosition(box, row, boat);
			}

			if (vertical) {
				boxes = setVerticalBoatPosition(box, boat);
			}

			setBoxesOver(boxes);
			updateItems((prevItems) => {
				return prevItems.map((item) => {
					if (boxes.includes(item.box)) {
						item.over = true;
					} else {
						item.over = false;
					}

					return item;
				});
			});

			return boxes;
		},
		[orientation, updateItems, setBoxesOver],
	);

	const randomOrientation = () => {
		orientation.current = [ORIENTATION.VERTICAL, ORIENTATION.HORIZONTAL][
			randomNumber(0, 1)
		];
	};

	return {
		setBoatPosition,
		switchOrientation,
		randomOrientation,
		orientation: orientation.current,
	};
};

export default useGameHook;
