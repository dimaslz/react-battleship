import { render, screen } from "@testing-library/react";

import history from "@/mocks/history-computer-1-boat-sunk.json";
import { History } from "@/types";

import { GameHistory } from ".";

describe("[Components]: GameHistory", () => {
	test("computer boat is sunk", () => {
		render(<GameHistory history={history as History[]} />);

		expect(screen.getByLabelText("🙋‍♂️ [2023/06/11 - 19:52:40]: H4 - 💥 - 🔻 sunk!"));
		expect(screen.getByLabelText("🙋‍♂️ [2023/06/11 - 19:52:23]: H3 - 💥"));
		expect(screen.getByLabelText("🙋‍♂️ [2023/06/11 - 19:52:19]: H2 - 💥"));
		expect(screen.getByLabelText("🙋‍♂️ [2023/06/11 - 19:52:14]: H1 - 💥"));
	});
});