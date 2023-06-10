import { Player } from ".";

type Hits = {
	[K in Player]: number[];
}

export default Hits;