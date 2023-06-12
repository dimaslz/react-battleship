import { PLAYER, SHOT_VALUE } from '@/constants';
import { BoardBoxItem, BoardRow, BoatsInGame } from '@/types';

type Props = {
	board: BoardRow[];
	boatsInGame: BoatsInGame | undefined;
};

const ComputerBoard = ({ board, boatsInGame }: Props) => {

	const isSunk = (item: BoardBoxItem) => {
		if (!boatsInGame) return false;

		const boatId = item.player[PLAYER.COMPUTER].filled;
		const boat = boatsInGame[PLAYER.COMPUTER]?.find(({ id }) => id === boatId);

		return boat?.sunk;
	};

	const isTouched = (item: BoardBoxItem) => {
		return item.player[PLAYER.COMPUTER].shot?.value === SHOT_VALUE.TOUCH;
	};

	const isWater = (item: BoardBoxItem) => {
		return item.player[PLAYER.COMPUTER].shot?.value === SHOT_VALUE.WATER;
	};

	return (
		<>
			<div className="flex flex-col w-full justify-center items-center">
				{board.map((row, rowKey) => (
					<div key={rowKey} className="flex">
						{row.map((box) => (
							<div className="flex" key={box.label}>
								<div
									className={[
										'w-[50px] h-[50px] flex items-center justify-center text-xs border border-dashed flex-col',
										isTouched(box)
											? 'border-red-400 border-2 font-bold'
											: '',
										isWater(box)
											? 'border-blue-400 border-2 font-bold'
											: '',
										box.player[PLAYER.HUMAN].shot?.value === SHOT_VALUE.TOUCH
											? isSunk(box) ? 'bg-red-800' : 'bg-red-400'
											: box.player[PLAYER.COMPUTER].filled ? 'bg-slate-200' : '',
									].join(' ')}
								>
									{box.label}
								</div>
							</div>
						))}
					</div>
				))}
			</div>
		</>
	);
};

export default ComputerBoard;
