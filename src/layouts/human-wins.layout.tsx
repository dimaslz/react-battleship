type Props = {
	onClickReset: () => void;
};

const HumanWinsLayout = ({ onClickReset }: Props) => {
	return <div className="flex">
		<div className="absolute z-10 inset-0 w-full h-full bg-white text-green-600 flex items-center justify-center flex-col">
			<div className="text-8xl">You wins!!! Congrats! 🏆</div>
			<button
				onClick={onClickReset}
				className="py-2 px-4 bg-blue-800 text-white hover:bg-blue-950 mt-12 rounded-full"
			>
				reset game
			</button>
		</div>
	</div>;
};

export default HumanWinsLayout;