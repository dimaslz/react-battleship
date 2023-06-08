import { act, renderHook } from "@testing-library/react";

import { BOATS, LETTERS, MAX_SCORES } from "@/constants";
import { generateItems } from "@/methods";
import { BOARD_BOX_ITEM, BOARD_ROW } from "@/types";

import useBoard from "./use-board.hook";

describe("[Hooks]: useBoard", () => {
	describe("default values", () => {
		let expected: any;

		beforeAll(async () => {
			const items = generateItems();

			expected = await act(async () => {
				const { result } = await renderHook(() => useBoard(items));

				return result;
			});
		});

		test("`turn` should be 'null'", async () => {
			const { turn } = expected.current;
			expect(turn).toBe(null);
		});

		test("`items` should have 100 elements", async () => {
			const { items } = expected.current;
			expect(items).toHaveLength(100);
		});

		describe("`board` should be a matrix of 10x10", () => {
			test("10 rows", async () => {
				const { board } = expected.current;

				expect(board).toHaveLength(10);
			});

			test("and each row 10 columns", async () => {
				const { board } = expected.current;

				board.forEach((row: BOARD_ROW) => {
					expect(row).toHaveLength(10);
				});
			});

			test("each element should have the proper label", async () => {
				const { board } = expected.current;

				board.forEach((row: BOARD_ROW, rowKey: number) => {
					row.forEach((element: BOARD_BOX_ITEM, elementKey) => {
						expect(element.label).toBe(`${LETTERS[elementKey]}${rowKey + 1}`);
					});
				});
			});
		});

		test("'scores' are 0 for both players", () => {
			const { scores } = expected.current;

			expect(scores.human).toBe(0);
			expect(scores.computer).toBe(0);
		});

		test("nobody wins yet", () => {
			const { computerWins, humanWins } = expected.current;

			expect(computerWins).toBe(false);
			expect(humanWins).toBe(false);
		});

		test(`max possible scores are ${BOATS}`, () => {
			const { maxScores } = expected.current;

			expect(maxScores).toBe(MAX_SCORES);
		});

		test("'setTurn' should exists and is a function", () => {
			const { setTurn } = expected.current;

			expect(setTurn).toBeTruthy();
			expect(typeof setTurn).toBe("function");
		});

		test("'setTurn' should exists and is a function", () => {
			const { updateItems } = expected.current;

			expect(updateItems).toBeTruthy();
			expect(typeof updateItems).toBe("function");
		});
	});
});
