import dayjs from "dayjs";

import { PLAYER, SHOT_VALUE } from "@/constants";
import { HISTORY } from "@/types";

type Props = {
	history: HISTORY[]
}

const GameHistory = ({ history }: Props) => {
	return (
		<div className='mt-7'>
			{history.length ? (
				<div className='w-auto overflow-y-scroll text-left space-y-2 h-[400px]'>
				{history.map((historyItem, historyItemIndex) => {
					const date = dayjs(historyItem.date).format("YYYY/MM/DD - HH:mm:ss");
					const who = historyItem.who === PLAYER.COMPUTER ? "💻" : "🙋‍♂️";
					const value = historyItem.value === SHOT_VALUE.WATER ? "💦" : "💥";

					return (
						<div className='text-sm flex space-x-2' key={historyItemIndex}>
							<div>{who} [{date}]:</div>
							<div className='text-slate-600'>{historyItem.label} - {value}</div>
						</div>
					);
				})}
			</div>
			) : (
				<div className='w-full h-[420px] flex items-center justify-center text-slate-400'>
					You will see the history here
				</div>
			)}
		</div>
	);
};

export default GameHistory;