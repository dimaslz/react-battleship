import { LETTERS } from "@/constants";
import items from "@/mocks/items.json";
import { BoardBoxItem, BoardRow } from "@/types";

import { createBoard } from ".";

describe("[Method]: createBoard", () => {
	let board: BoardRow[];
	beforeAll(() => {
		board = createBoard(items);
	});
	describe("`board` should be a matrix of 10x10", () => {
		test("10 rows", async () => {
			expect(board).toHaveLength(10);
		});

		test("and each row 10 columns", async () => {
			board.forEach((row: BoardRow) => {
				expect(row).toHaveLength(10);
			});
		});

		test("each element should have the proper label", async () => {
			board.forEach((row: BoardRow, rowKey: number) => {
				row.forEach((element: BoardBoxItem, elementKey) => {
					expect(element.label).toBe(`${LETTERS[elementKey]}${rowKey + 1}`);
				});
			});
		});
	});
});
