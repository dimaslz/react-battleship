import { PLAYER, SHOT_VALUE } from "@/constants";
import { BoardBoxItem, BoatsInGame, Player } from "@/types";

type Props = {
	item: BoardBoxItem | undefined;
	boatsInGame: BoatsInGame;
	items: BoardBoxItem[];
	from: Player;
}

const boatIsSunk = ({ items, item, from, boatsInGame }: Props) => {
	const opponent = from === PLAYER.HUMAN
		? PLAYER.COMPUTER : PLAYER.HUMAN;

	const shot = item?.player[opponent].filled;
	if (!shot) return false;

	const boatSquares = items.filter((i) => (
		i.player[opponent].filled === shot
		&& i.player[from].shot?.value === SHOT_VALUE.TOUCH
	)).map(i => i.box).concat(item.box);

	return (boatsInGame[opponent].find(
		(boatInGame) => boatInGame.id === shot,
	)?.squares || []).every((square) => boatSquares.includes(square));
};

export default boatIsSunk;