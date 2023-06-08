import { TPLAYER_TYPE } from "@/types";

type Scores = {
	[K in TPLAYER_TYPE]: number;
};

type Props = {
	scores: Scores;
	maxScores: number;
}

const ScoreBoard = ({ scores, maxScores }: Props) => {
	return (
		<div className="w-auto space-y-4 text-left">
			<div className='flex'>
				<div className='w-32'>You:</div>
				<div className='w-full border border-dashed relative text-left'>
					<div className='bg-green-600 h-full' style={{ width: `${100 * scores.human / maxScores}%` }}></div>
					<div className="h-full absolute left-2 top-0 bottom-0 text-white text-sm flex items-center">{scores.human}</div>
				</div>
				<div className='w-12 text-right'>🥇</div>
			</div>
			<div className='flex'>
				<div className='w-32'>Computer:</div>
				<div className='w-full border border-dashed relative'>
					<div className='bg-red-600 h-full' style={{ width: `${100 * scores.computer / maxScores}%` }}></div>
					<div className="h-full absolute left-2 top-0 bottom-0 text-white text-sm flex items-center">{scores.computer}</div>
				</div>
				<div className='w-12 text-right'>🥇</div>
			</div>
		</div>
	);
};

export default ScoreBoard;