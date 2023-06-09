import { SHOT_VALUE } from "@/constants";
import { TSHOT_VALUE } from "@/types";

type Props = {
	type: TSHOT_VALUE;
	content: string;
}

const ShotFeedback = ({ type, content }: Props) => {
	return <div className="absolute z-10 inset-0 flex items-center justify-center w-full h-full">
		<div className="flex items-center justify-center flex-col w-[600px] bg-white">
			<div
				className={[
					'text-4xl',
					type === SHOT_VALUE.WATER
						? 'text-blue-400'
						: 'text-green-400',
				].join(' ')}
			>
				{content}
			</div>
		</div>
	</div>;
};

export default ShotFeedback;