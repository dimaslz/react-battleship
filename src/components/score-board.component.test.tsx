import { render, screen } from "@testing-library/react";

import { MAX_SCORES } from "@/constants";

import { ScoreBoard } from ".";

describe("[Components]: ScoreBoard", () => {
	test("computer player is winning", () => {
		const scores = {
			computer: 7,
			human: 0,
		};

		render(<ScoreBoard scores={scores} maxScores={MAX_SCORES} />);

		const element = screen.getByTestId("computer-player-scores");
		const style = window.getComputedStyle(element);
		expect(
			style.width,
		).toBe("53.84615384615385%");
	});

	test("computer player is wins", () => {
		const scores = {
			computer: MAX_SCORES,
			human: 0,
		};

		render(<ScoreBoard scores={scores} maxScores={MAX_SCORES} />);

		const element = screen.getByTestId("computer-player-scores");
		const style = window.getComputedStyle(element);
		expect(
			style.width,
		).toBe("100%");
	});
});