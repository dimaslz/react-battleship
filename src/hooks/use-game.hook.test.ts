import { act, renderHook } from "@testing-library/react";
import { vi } from "vitest";

import items from "@/mocks/items.json";

import { useGame } from ".";

describe("[Hooks]: useGame", () => {
	let expected: any;
	const setBoxesOverMock = vi.fn();

	beforeAll(async () => {
		expected = await act(async () => {
			const { result } = await renderHook(() => useGame({ items, setBoxesOver: setBoxesOverMock }));

			return result;
		});
	});

	describe("default values", () => {
		test("'setBoatPosition' is present", () => {
			const { setBoatPosition } = expected.current;

			expect(typeof setBoatPosition).toBe("function");
		});

		test("'switchOrientation' is present", () => {
			const { switchOrientation } = expected.current;

			expect(typeof switchOrientation).toBe("function");
		});

		test("'randomOrientation' is present", () => {
			const { randomOrientation } = expected.current;

			expect(typeof randomOrientation).toBe("function");
		});

		test("'history' is '[]' by default", () => {
			const { history } = expected.current;

			expect(history).toStrictEqual([]);
		});

		test("'playersAreReady' is 'false' by default", () => {
			const { playersAreReady } = expected.current;

			expect(playersAreReady).toBe(false);
		});
	});

	describe("actions", () => {
		test("'setBoxesOver' is called when call setBoatPosition", () => {
			const { setBoatPosition } = expected.current;

			const boxes = setBoatPosition({ box: 55, boat: 5 });

			expect(boxes).toStrictEqual([53, 54, 55, 56, 57]);
			expect(setBoxesOverMock).toBeCalled();
		});
	});
});