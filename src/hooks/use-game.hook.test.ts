import { act, renderHook } from "@testing-library/react";
import { vi } from "vitest";

import items from "@/mocks/items.json";

import { useGame } from ".";

describe("[Hooks]: useGame", () => {
	let expected: any;
	const setBoxesOverMock = vi.fn();

	beforeAll(async () => {
		expected = await act(async () => {
			const { result } = await renderHook(() => useGame({ initialItems: items, setBoxesOver: setBoxesOverMock }));

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

		test("'setGameReady' is present", () => {
			const { setGameReady } = expected.current;

			expect(typeof setGameReady).toBe("function");
		});

		test("'updateGameCounterValue' is present", () => {
			const { updateGameCounterValue } = expected.current;

			expect(typeof updateGameCounterValue).toBe("function");
		});

		test("'updateGameCounterLabel' is present", () => {
			const { updateGameCounterLabel } = expected.current;

			expect(typeof updateGameCounterLabel).toBe("function");
		});

		test("'updateBoatsInGame' is present", () => {
			const { updateBoatsInGame } = expected.current;

			expect(typeof updateBoatsInGame).toBe("function");
		});

		test("'setTurn' is present", () => {
			const { setTurn } = expected.current;

			expect(typeof setTurn).toBe("function");
		});

		test("'updateItems' is present", () => {
			const { updateItems } = expected.current;

			expect(typeof updateItems).toBe("function");
		});

		test("'history' is '[]' by default", () => {
			const { history } = expected.current;

			expect(history).toStrictEqual([]);
		});

		test("'playersAreReady' is 'false' by default", () => {
			const { playersAreReady } = expected.current;

			expect(playersAreReady).toBe(false);
		});

		test("'counter' has '0' and '' (empty) label", () => {
			const { counter } = expected.current;

			expect(counter.value).toBe(5);
			expect(counter.label).toBe('');
		});

		test("'boatsInGame' has default values", () => {
			const { boatsInGame } = expected.current;

			expect(boatsInGame).toStrictEqual({ human: [], computer: [] });
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