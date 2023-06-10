import { Player, Shot } from ".";

type PlayerStatus = {
	shot: null | {
		value: Shot;
		date: number;
		sunk: boolean;
	};
	filled: null | string;
}

type BoardBoxItem = {
	box: number;
	col: number;
	row: number;
	label: string;
	over: boolean;
	player: { [key in Player]: PlayerStatus };
};

export default BoardBoxItem;
