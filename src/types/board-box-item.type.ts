type BOARD_BOX_ITEM = {
	box: number;
	col: number;
	row: number;
	label: string;
	over: boolean;
	player: { [key: string]: any | null };
};

export default BOARD_BOX_ITEM;