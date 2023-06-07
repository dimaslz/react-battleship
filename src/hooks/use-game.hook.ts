import { useCallback, useRef } from "react";
import { BOARD_BOX_ITEM, TORIENTATION } from "../types";
import { BOARD_SIZE, ORIENTATION } from "../constants";
import { randomNumber } from "../utils";
import { createArray } from "../methods";

type Props = {
	setBoxesOver: (arr: number[]) => void;
	updateItems: React.Dispatch<React.SetStateAction<BOARD_BOX_ITEM[]>>;
};

const useGameHook = ({
	setBoxesOver,
	updateItems,
}: Props) => {
	const orientation = useRef<TORIENTATION>(ORIENTATION.HORIZONTAL);

	const switchOrientation = useCallback(() => {
		orientation.current = orientation.current === ORIENTATION.HORIZONTAL
			? ORIENTATION.VERTICAL
			: ORIENTATION.HORIZONTAL;
	}, [orientation])

	const setBoatPosition = useCallback(({ box, row, boat }: any) => {
		const horizontal = orientation.current === ORIENTATION.HORIZONTAL;
		const vertical = orientation.current === ORIENTATION.VERTICAL;

		let boxes = [box]
		const even = Boolean(boat % 2);
		const rest = Math.ceil(boat / 2);

		if (horizontal) {
			const boxLeft = even ? rest - 1 : rest;
			const boxRight = even ? rest - 1 : rest - 1;

			boxes = [
				...createArray(boxLeft).map((_, k) => box - (k + 1)).reverse(),
				...boxes,
				...createArray(boxRight).map((_, k) => box + (k + 1))
			];

			const outLeft = Math.max(0, (BOARD_SIZE * (row - 1)) - (boxes[0] + 1) + boxLeft);
			const outRight = Math.max(0, ((boxes[boxes.length - 1]) - (BOARD_SIZE * row)));

			if (outLeft > 0) {
				boxes = [
					...createArray(boxLeft - outLeft).map((_, k) => box - (k + 1)).reverse(),
					box,
					...createArray(outLeft + boxRight).map((_, k) => box + (k + 1))
				];
			}
			if (outRight > 0) {
				boxes = [
					...createArray(outRight + boxLeft).map((_, k) => box - (k + 1)).reverse(),
					box,
					...createArray(boxRight - outRight).map((_, k) => box + (k + 1)),
				];
			}
		}

		if (vertical) {
			const boxTop = even ? rest - 1 : rest;
			const boxBottom = even ? rest - 1 : rest - 1;

			boxes = [
				...createArray(boxTop).map((_, k) => {
					return box - ((k + 1) * BOARD_SIZE)
				}).reverse(),
				...boxes,
				...createArray(boxBottom).map((_, k) => {
					return box + ((k + 1) * BOARD_SIZE)
				})
			];

			const outTop = boxes.filter(i => i <= 0).length;
			const outBottom = boxes.filter(i => i > 100).length;

			if (outTop > 0) {
				boxes = [
					...createArray(boxTop - outTop).map((_, k) => {
						return box - ((k + 1) * BOARD_SIZE)
					}),
					box,
					...createArray(outTop + boxBottom).map((_, k) => {
						return box + ((k + 1) * BOARD_SIZE)
					})
				];
			} else if (outBottom > 0) {
				boxes = [
					...createArray(boxTop + outBottom).map((_, k) => {
						return box - ((k + 1) * BOARD_SIZE)
					}).reverse(),
					box,
					...createArray(boxBottom - outBottom).map((_, k) => {
						return box + ((k + 1) * BOARD_SIZE)
					})
				];
			}
		}

		setBoxesOver(boxes);
		updateItems((prevItems) => {
			return (prevItems.map((item) => {
				if (boxes.includes(item.box)) {
					item.over = true
				} else {
					item.over = false
				}

				return item;
			}))
		});

		return boxes;
	}, [orientation, updateItems, setBoxesOver])

	const randomOrientation = () => {
		orientation.current = [ORIENTATION.VERTICAL, ORIENTATION.HORIZONTAL][randomNumber(0, 1)];
	}

	return {
		setBoatPosition,
		switchOrientation,
		randomOrientation,
		orientation: orientation.current,
	}
}

export default useGameHook;