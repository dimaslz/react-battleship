import { PLAYER, SHOT_VALUE } from '@/constants';
import { BOARD_BOX_ITEM, BOARD_ROW } from '@/types';

type Props = {
	board: BOARD_ROW[];
	hideBoats: boolean;
	disableClick: boolean;
	onMouseOver: (item: BOARD_BOX_ITEM) => void;
	onClick: (item: BOARD_BOX_ITEM) => void;
};

const HumanBoard = ({
	board,
	onMouseOver,
	onClick,
	hideBoats,
	disableClick,
}: Props) => {
	return (
		<>
			{board.map((row, rowKey) => {
				return (
					<div key={rowKey} className="flex">
						{row.map((item: BOARD_BOX_ITEM) => (
							<div
								key={item.label}
								onMouseOver={() => onMouseOver(item)}
								onClick={() => onClick(item)}
								className={[
									'w-[50px] h-[50px] flex items-center justify-center text-xs border border-dashed hover:border-2 hover:border-slate-600 flex-col',
									item.player[PLAYER.HUMAN].shot?.value === SHOT_VALUE.TOUCH
										? 'border-red-400 border-2 hover:!cursor-not-allowed'
										: '',
									item.player[PLAYER.HUMAN].shot?.value === SHOT_VALUE.WATER
										? 'border-blue-400 border-2 hover:!cursor-not-allowed'
										: '',
									item.player[PLAYER.COMPUTER].shot?.value === SHOT_VALUE.TOUCH
										? 'bg-red-400'
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
