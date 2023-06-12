import { render, screen } from "@testing-library/react";

import history from "@/mocks/history-computer-1-boat-sunk.json";
import { History } from "@/types";

import { GameHistory } from ".";

describe("[Components]: GameHistory", () => {
	test("computer boat is sunk", () => {
		render(<GameHistory history={history as History[]} />);

		expect(screen.getByLabelText("🙋‍♂️: H4 - 💥 - 🔻 sunk!"));
		expect(screen.getByLabelText("🙋‍♂️: H3 - 💥"));
		expect(screen.getByLabelText("🙋‍♂️: H2 - 💥"));
		expect(screen.getByLabelText("🙋‍♂️: H1 - 💥"));
	});
});