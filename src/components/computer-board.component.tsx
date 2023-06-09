import { PLAYER, SHOT_VALUE } from '@/constants';
import { BoardRow } from '@/types';

type Props = {
	board: BoardRow[];
};

const ComputerBoard = ({ board }: Props) => {
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
										box.player[PLAYER.COMPUTER].shot?.value === SHOT_VALUE.TOUCH
											? 'border-red-400 border-2'
											: '',
										box.player[PLAYER.COMPUTER].shot?.value === SHOT_VALUE.WATER
											? 'border-blue-400 border-2'
											: '',
										box.player[PLAYER.HUMAN].shot?.value === SHOT_VALUE.TOUCH
											? 'bg-red-400'
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
