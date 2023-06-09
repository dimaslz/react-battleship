import { BoardBoxItem, Player, Shot } from ".";

type History = BoardBoxItem & {
	who: Player;
	date: number;
	value: Shot;
}

export default History;