import { Boat, Player } from ".";

type BoatsInGame = {
	[K in Player]: (Boat & { squares: number[]; sunk: boolean; })[]
}

export default BoatsInGame;