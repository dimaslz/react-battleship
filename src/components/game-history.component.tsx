import dayjs from "dayjs";

import { PLAYER, SHOT_VALUE } from "@/constants";
import { History } from "@/types";

type Props = {
	history: History[];
}

const GameHistory = ({ history }: Props) => {
	return (
		<div className='mt-7'>
			{history.length ? (
				<div>
					<div className="text-sm text-left">({history.length} moves)</div>
					<div className='w-auto overflow-y-scroll text-left space-y-2 h-[400px] pt-2'>
						{history.map((historyItem, historyItemIndex) => {
							const date = dayjs(historyItem.date).format("YYYY/MM/DD - HH:mm:ss");
							const who = historyItem.who === PLAYER.COMPUTER ? "💻" : "🙋‍♂️";
							const value = historyItem.value === SHOT_VALUE.WATER ? "💦" : "💥";
							const isSunk = historyItem.sunk ? " - 🔻 sunk!" : '';

							return (
								<div
									className='text-sm flex space-x-2'
									key={historyItemIndex}
									aria-label={`${who} [${date}]: ${historyItem.label} - ${value}${isSunk}`}
								>
									<div>{who} [{date}]:</div>
									<div className='text-slate-600'>{historyItem.label} - {value}{isSunk}</div>
								</div>
							);
						})}
					</div>
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