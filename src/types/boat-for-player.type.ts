import { BOAT } from ".";

type BoatForPlayer = BOAT & {
	pending: boolean;
	done: boolean;
}

export default BoatForPlayer;