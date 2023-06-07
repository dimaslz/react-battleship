import { createArray } from ".";
import { BOARD_SIZE } from "../constants";

const setHorizontalBoatPosition = (box: number, row: number, boatSize: number) => {
	let boxes = [box]
	const even = Boolean(boatSize % 2);
	const rest = Math.ceil(boatSize / 2);

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

	return boxes;
}

export default setHorizontalBoatPosition;
