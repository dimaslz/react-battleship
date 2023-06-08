import { BOARD_BOX_ITEM, TPLAYER_TYPE, TSHOT_VALUE } from ".";

type HISTORY = BOARD_BOX_ITEM & {
	who: TPLAYER_TYPE;
	date: number;
	value: TSHOT_VALUE;
}

export default HISTORY;