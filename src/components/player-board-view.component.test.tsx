import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

import { PLAYER } from "@/constants";
import board from "@/mocks/board.json";

import { PlayerBoardView } from ".";

describe("[Components]: PlayerBoardView", () => {
	const onMouseLeave = vi.fn();
	const onMouseOver = vi.fn();
	const onClick = vi.fn();

	describe("default", () => {
		test("component should be render", () => {
			const view = render(<PlayerBoardView
				onClick={onClick}
				onMouseLeave={onMouseLeave}
				onMouseOver={onMouseOver}
				board={board}
				gameReady={false}
				counter={{
					value: 0,
					label: '',
				}}
				disableClick={false}
				turn={PLAYER.HUMAN}
			/>);

			expect(view.baseElement).toBeInTheDocument();
		});
	});

	describe("callbacks", () => {
		test("onClick is called when user click a box in the board", async () => {
			const clickObj = { fn: () => ({}) };
			const onClick = vi.spyOn(clickObj, "fn");

			render(<PlayerBoardView
				onClick={clickObj.fn}
				onMouseLeave={onMouseLeave}
				onMouseOver={onMouseOver}
				board={board}
				gameReady={false}
				counter={{
					value: 0,
					label: '',
				}}
				disableClick={false}
				turn={PLAYER.HUMAN}
			/>);

			const boxElement = screen.getByText("D4");
			await userEvent.click(boxElement);

			expect(onClick).toBeCalled();
			expect(onClick).toHaveBeenCalledWith({
				box: 34,
				col: 4,
				label: 'D4',
				over: false,
				player: {
					computer: {
						filled: false,
						shot: null,
					},
					human: {
						filled: false,
						shot: null,
					},
				},
				row: 4,
			});
		});

		test("onMouseOver is called when user is over to a box in the board", async () => {
			const onMouseOverObj = { fn: () => ({}) };
			const onMouseOver = vi.spyOn(onMouseOverObj, "fn");

			render(<PlayerBoardView
				onClick={onClick}
				onMouseLeave={onMouseLeave}
				onMouseOver={onMouseOverObj.fn}
				board={board}
				gameReady={false}
				counter={{
					value: 0,
					label: '',
				}}
				disableClick={false}
				turn={PLAYER.HUMAN}
			/>);

			const boxElement = screen.getByText("D4");
			await userEvent.hover(boxElement);

			expect(onMouseOver).toBeCalled();
			expect(onMouseOver).toHaveBeenCalledWith({
				box: 34,
				col: 4,
				label: 'D4',
				over: false,
				player: {
					computer: {
						filled: false,
						shot: null,
					},
					human: {
						filled: false,
						shot: null,
					},
				},
				row: 4,
			});
		});

		test("onMouseLeave is called when user leaves the board", async () => {
			const onMouseLeaveObj = { fn: () => ({}) };
			const onMouseLeave = vi.spyOn(onMouseLeaveObj, "fn");

			render(<div>
				<div>out</div>
				<PlayerBoardView
					onClick={onClick}
					onMouseLeave={onMouseLeaveObj.fn}
					onMouseOver={onMouseOver}
					board={board}
					gameReady={false}
					counter={{
						value: 0,
						label: '',
					}}
					disableClick={false}
					turn={PLAYER.HUMAN}
				/>
			</div>);

			const boardElement = screen.getByTestId("player-board-view");

			await fireEvent.mouseLeave(boardElement);

			expect(onMouseLeave).toBeCalled();
		});
	});
});