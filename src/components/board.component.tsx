import { BOARD_BOX_ITEM, BOARD_ROW } from "../types";

type Props = {
	board: BOARD_ROW[];
	ItemComponent: ({ item }: { item: BOARD_BOX_ITEM }) => JSX.Element;
};

const Board = ({ board, ItemComponent }: Props) => {
	return <>
		<div className='flex flex-col w-full justify-center items-center'>
			{board.map((row, rowKey) => (
				<div key={rowKey} className='flex'>
					{row.map((box: any) => (
						<div className='flex' key={box.label}>
							<ItemComponent item={box} />
						</div>
					))}
				</div>
			))}
		</div>
	</>
}

export default Board;