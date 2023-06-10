import { act, renderHook } from "@testing-library/react";

import { BOARD_SIZE, LETTERS, MAX_SCORES, PLAYER, SHOT_VALUE } from "@/constants";
import items from "@/mocks/items.json";
import { BoardBoxItem, BoardRow } from "@/types";
import { randomNumber } from "@/utils";

import useBoard from "./use-board.hook";

describe("[Hooks]: useBoard", () => {
	let expected: any;

	beforeAll(async () => {
		expected = await act(async () => {
			const { result } = await renderHook(() => useBoard(items));

			return result;
		});
	});

	describe("default values", () => {
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

				board.forEach((row: BoardRow) => {
					expect(row).toHaveLength(10);
				});
			});

			test("each element should have the proper label", async () => {
				const { board } = expected.current;

				board.forEach((row: BoardRow, rowKey: number) => {
					row.forEach((element: BoardBoxItem, elementKey) => {
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

		test(`max possible scores are ${MAX_SCORES}`, () => {
			const { maxScores } = expected.current;

			expect(maxScores).toBe(MAX_SCORES);
		});

		test("'setTurn' should exists and is a function", () => {
			const { setTurn } = expected.current;

			expect(setTurn).toBeTruthy();
			expect(typeof setTurn).toBe("function");
		});

		test("'updateItems' should exists and is a function", () => {
			const { updateItems } = expected.current;

			expect(updateItems).toBeTruthy();
			expect(typeof updateItems).toBe("function");
		});
	});

	describe("actions", () => {
		const box = randomNumber(1, BOARD_SIZE * BOARD_SIZE);
		const date = Date.now();

		test("update items", () => {
			const { updateItems, items } = expected.current;

			updateItems((prevItems: BoardBoxItem[]) => {
				return prevItems.map((item) => {
					if (item.box === box) {
						item.player[PLAYER.COMPUTER].shot = {
							date,
							value: SHOT_VALUE.TOUCH,
							sunk: false,
						};
					}

					return item;
				});
			});

			const item = items.find((_item: BoardBoxItem) => _item.box === box);
			expect(item.player).toStrictEqual({
				computer: {
					filled: null,
					shot: {
						date,
						value: SHOT_VALUE.TOUCH,
						sunk: false,
					},
				},
				human: {
					filled: null,
					shot: null,
				},
			});
		});

		test("board matrix is updated", () => {
			const { board } = expected.current;

			const row = Math.ceil(box / 10);
			const item = board[row - 1].find((col: BoardBoxItem) => col.box === box);

			expect(item.player).toStrictEqual({
				computer: {
					filled: null,
					shot: {
						date,
						value: SHOT_VALUE.TOUCH,
						sunk: false,
					},
				},
				human: {
					filled: null,
					shot: null,
				},
			});
		});

	});
});
