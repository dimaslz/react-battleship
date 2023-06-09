import { render } from "@testing-library/react";
import { vi } from "vitest";

import { PLAYER } from "@/constants";
import board from "@/mocks/board.json";

import { PlayerBoardView } from ".";

describe("[Components]: PlayerBoardView", () => {
	const onMouseLeave = vi.fn();
	const onMouseOver = vi.fn();
	const onClick = vi.fn();

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