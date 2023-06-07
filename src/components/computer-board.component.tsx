import { PLAYER, SHOT_VALUE } from "../constants"
import { BOARD_ROW } from "../types";

type Props = {
	board: BOARD_ROW[];
};

const ComputerBoard = ({ board}: Props) => {
	return <>
		<div className='flex flex-col w-full justify-center items-center'>
			{board.map((row, rowKey) => (
				<div key={rowKey} className='flex'>
					{row.map((box: any) => (
						<div className='flex' key={box.label}>
							<div
								className={[
									"w-[50px] h-[50px] flex items-center justify-center text-xs border border-dashed flex-col",
									box.player[PLAYER.COMPUTER].filled ? 'bg-slate-200' : '',
									box.player[PLAYER.COMPUTER].shot === SHOT_VALUE.TOUCH ? 'border-red-400 border-2' : '',
									box.player[PLAYER.COMPUTER].shot === SHOT_VALUE.WATER ? 'border-blue-400 border-2' : '',
									box.player[PLAYER.HUMAN].shot === SHOT_VALUE.TOUCH ? 'bg-red-400' : '',
								].join(' ')}
							>{box.label}</div>
						</div>
					))}
				</div>
			))}
		</div>
	</>
}

export default ComputerBoard;
