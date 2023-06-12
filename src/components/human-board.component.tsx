import { PLAYER, SHOT_VALUE } from '@/constants';
import { BoardBoxItem,BoardRow, BoatsInGame } from '@/types';

type Props = {
	board: BoardRow[];
	hideBoats: boolean;
	disableClick: boolean;
	boatsInGame: BoatsInGame | undefined;
	onMouseOver: (item: BoardBoxItem) => void;
	onClick: (item: BoardBoxItem) => void;
};

const HumanBoard = ({
	onMouseOver,
	onClick,
	board,
	hideBoats,
	disableClick,
	boatsInGame,
}: Props) => {

	const isSunk = (item: BoardBoxItem) => {
		if (!boatsInGame) return false;

		const boatId = item.player[PLAYER.HUMAN].filled;
		const boat = boatsInGame[PLAYER.HUMAN]?.find(({ id }) => id === boatId);

		return boat?.sunk;
	};

	const opponentBoatIsSunk = (item: BoardBoxItem) => {
		if (!boatsInGame) return false;

		const boatId = item.player[PLAYER.COMPUTER].filled;
		const boat = boatsInGame[PLAYER.COMPUTER]?.find(({ id }) => id === boatId);

		return boat?.sunk;
	};

	return (
		<>
			{board.map((row, rowKey) => {
				return (
					<div key={rowKey} className="flex">
						{row.map((item: BoardBoxItem) => (
							<div
								key={item.label}
								onMouseOver={() => onMouseOver(item)}
								onClick={() => onClick(item)}
								className={[
									'w-[50px] h-[50px] flex items-center justify-center text-xs border border-dashed hover:border-2 hover:border-slate-600 flex-col',
									item.player[PLAYER.HUMAN].shot?.value === SHOT_VALUE.TOUCH
										? opponentBoatIsSunk(item) ? 'border-red-800 border-2 hover:!cursor-not-allowed text-red-800 font-bold' : 'border-red-400 border-2 hover:!cursor-not-allowed font-bold'
										: '',
									item.player[PLAYER.HUMAN].shot?.value === SHOT_VALUE.WATER
										? 'border-blue-400 border-2 hover:!cursor-not-allowed font-bold'
										: '',
									item.player[PLAYER.COMPUTER].shot?.value === SHOT_VALUE.TOUCH
										? isSunk(item) ? 'bg-red-800' : 'bg-red-400'
										: '',
									item.over && !disableClick ? 'bg-slate-200' : '',
									item.over && disableClick
										? 'bg-red-200 hover:cursor-not-allowed'
										: 'hover:cursor-pointer',
									!hideBoats && item.player[PLAYER.HUMAN].filled
										? 'bg-blue-500'
										: '',
									hideBoats && item.player[PLAYER.HUMAN].filled
										? 'bg-blue-50'
										: '',
								].join(' ')}
							>
								{item.label}
							</div>
						))}
					</div>
				);
			})}
		</>
	);
};

export default HumanBoard;
