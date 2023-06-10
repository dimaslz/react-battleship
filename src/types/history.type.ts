import { BoardBoxItem, Player, Shot } from ".";

type History = BoardBoxItem & {
	who: Player;
	date: number;
	value: Shot;
	sunk: boolean;
}

export default History;