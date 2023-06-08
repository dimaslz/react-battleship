import { TPLAYER_TYPE, TSHOT_VALUE } from ".";

type PlayerStatus = {
	shot: null | {
		value: null | TSHOT_VALUE;
		date: number;
	};
	filled: boolean;
}

type BOARD_BOX_ITEM = {
	box: number;
	col: number;
	row: number;
	label: string;
	over: boolean;
	player: { [key in TPLAYER_TYPE]: PlayerStatus };
};

export default BOARD_BOX_ITEM;
