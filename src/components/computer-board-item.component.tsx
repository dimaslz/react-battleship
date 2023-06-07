import { PLAYER, SHOT_VALUE } from "../constants"
import { BOARD_BOX_ITEM } from "../types";

type Props = {
	item: BOARD_BOX_ITEM
};

const ComputerBoarItem = ({ item }: Props) => {
	return <>
		<div
			className={[
				"w-[50px] h-[50px] flex items-center justify-center text-xs border border-dashed flex-col",
				item.player[PLAYER.COMPUTER].filled ? 'bg-slate-200' : '',
				item.player[PLAYER.COMPUTER].shot === SHOT_VALUE.TOUCH ? 'border-red-400 border-2' : '',
				item.player[PLAYER.COMPUTER].shot === SHOT_VALUE.WATER ? 'border-blue-400 border-2' : '',
				item.player[PLAYER.HUMAN].shot === SHOT_VALUE.TOUCH ? 'bg-red-400' : '',
			].join(' ')}
		>{item.label}</div>
	</>
}

export default ComputerBoarItem;
