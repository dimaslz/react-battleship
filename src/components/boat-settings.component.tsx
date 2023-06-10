import { createArray } from "@/methods";
import { BoatForPlayer } from "@/types";

type Props = {
	boats: BoatForPlayer[];
	onClickBoat: (boat: BoatForPlayer, key: number) => void;
	onClickStartGame: () => void;
	playerBoatsDone: boolean;
	playersAreReady: boolean;
}

const BoatSettings = ({
	boats,
	onClickBoat,
	onClickStartGame,
	playerBoatsDone,
	playersAreReady,
}: Props) => {
	return (
		<div className="w-full px-4">
			<h2 className="text-4xl py-2">Boats</h2>
			<div className="text-sm py-4">
				<p>
					Here your boats! Click on one of them and (the color will turn
					to orange), and move the mouse to on the Board in the left.
					Press <code className="font-console text-slate-600">space</code> bar to
					change the orientation. Once you have desired where you want
					to sert your boat, click on the box in the board and back here
					to get other boat.
				</p>
			</div>
			<div className="w-auto space-y-4">
				{boats.map((boat, boatKey: number) => (
					<div
						className={[
							'relative text-white uppercase',
							boat.done ? 'cursor-not-allowed' : 'hover:cursor-pointer group',
						].join(' ')}
						key={boatKey}
						onClick={() => onClickBoat(boat, boatKey)}
					>
						<div className="w-full h-full absolute flex items-center justify-center pointer-events-none">
							{boat.label}
						</div>
						<div className="flex items-center justify-center pointer-events-none">
							{createArray(boat.length).map((_, squareKey: number) => {
								return (
									<div
										className={[
											'w-[50px] h-[50px] border',
											boat.pending ? 'bg-orange-200' : '',
											boat.done ? 'bg-green-200' : '',
											!boat.pending && !boat.done ? 'bg-blue-600 group-hover:bg-blue-800' : '',
										].join(' ')}
										key={squareKey}
									></div>
								);
							})}
						</div>
					</div>
				))}
			</div>

			<div className="mt-12">
				<button
					className={[
						'text-2xl py-2 px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-800 hover:cursor-pointer',
						!playerBoatsDone
							? 'cursor-not-allowed disabled:bg-gray-400'
							: '',
					].join(' ')}
					disabled={!playersAreReady}
					onClick={onClickStartGame}
				>
					start
				</button>
			</div>
		</div>
	);
};

export default BoatSettings;