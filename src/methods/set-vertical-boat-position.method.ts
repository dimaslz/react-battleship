import { BOARD_SIZE } from '../constants';
import { createArray } from '.';

const setVerticalBoatPosition = (box: number, boatSize: number) => {
	let boxes = [box];
	const even = Boolean(boatSize % 2);
	const rest = Math.ceil(boatSize / 2);

	const boxTop = even ? rest - 1 : rest;
	const boxBottom = even ? rest - 1 : rest - 1;

	boxes = [
		...createArray(boxTop)
			.map((_, k) => {
				return box - (k + 1) * BOARD_SIZE;
			})
			.reverse(),
		...boxes,
		...createArray(boxBottom).map((_, k) => {
			return box + (k + 1) * BOARD_SIZE;
		}),
	];

	const outTop = boxes.filter((i) => i <= 0).length;
	const outBottom = boxes.filter((i) => i > 100).length;

	if (outTop > 0) {
		boxes = [
			...createArray(boxTop - outTop).map((_, k) => {
				return box - (k + 1) * BOARD_SIZE;
			}),
			box,
			...createArray(outTop + boxBottom).map((_, k) => {
				return box + (k + 1) * BOARD_SIZE;
			}),
		];
	} else if (outBottom > 0) {
		boxes = [
			...createArray(boxTop + outBottom)
				.map((_, k) => {
					return box - (k + 1) * BOARD_SIZE;
				})
				.reverse(),
			box,
			...createArray(boxBottom - outBottom).map((_, k) => {
				return box + (k + 1) * BOARD_SIZE;
			}),
		];
	}

	return boxes;
};

export default setVerticalBoatPosition;
