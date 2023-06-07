import { BOAT, TORIENTATION, TPLAYER_TYPE } from "../types";

export const BOARD_SIZE = 10;
export const LETTERS = "ABCDEFGHIJ";

export const BOATS: BOAT[] = [{
	label: "Battleship",
	squares: 5,
}, {
	label: "Destroyer",
	squares: 4,
}, {
	label: "Destroyer",
	squares: 4,
}];

export const ORIENTATION: { [key: string]: TORIENTATION } = {
	"VERTICAL": "vertical",
	"HORIZONTAL": "horizontal",
}

export const PLAYER: { [key: string]: TPLAYER_TYPE } = {
	PLAYER: "player",
	COMPUTER: "computer",
}