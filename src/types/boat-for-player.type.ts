import { Boat } from ".";

type BoatForPlayer = Boat & {
	pending: boolean;
	done: boolean;
}

export default BoatForPlayer;