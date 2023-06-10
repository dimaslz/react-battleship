import { BOATS, PLAYER, SHOT_VALUE } from "@/constants";
import items from "@/mocks/items.json";
import { BoardBoxItem } from "@/types";

import { boatIsSunk } from ".";

describe("[Methods]: boatIsSunk", () => {
	const _items: BoardBoxItem[] = items;
	const boatsInGame = {
		"human": [{
			...BOATS[0],
			squares: [1, 2, 3, 4, 5],
			sunk: false,
		}, {
			...BOATS[1],
			squares: [11, 12, 13, 14],
			sunk: false,
		}, {
			...BOATS[2],
			squares: [21, 22, 23, 24],
			sunk: false,
		}],
		"computer": [{
			...BOATS[0],
			squares: [6, 7, 8, 9, 10],
			sunk: false,
		}, {
			...BOATS[1],
			squares: [17, 18, 19, 20],
			sunk: false,
		}, {
			...BOATS[2],
			squares: [27, 28, 29, 30],
			sunk: false,
		}],
	};

	beforeAll(() => {
		// setting boats for computer
		boatsInGame.computer.forEach((boat) => {
			boat.squares.forEach((square) => {
				_items[square - 1].player[PLAYER.COMPUTER].filled = boat.id;
			});
		});

		// setting boats for human
		boatsInGame.human.forEach((boat) => {
			boat.squares.forEach((square) => {
				_items[square - 1].player[PLAYER.HUMAN].filled = boat.id;
			});
		});
	});

	describe("Human player", () => {
		test("boat is sunk", () => {
			const positionOfSunkBoat = [1, 2, 3, 4];

			// setting shots¡
			positionOfSunkBoat.forEach((square) => {
				_items[square - 1].player[PLAYER.COMPUTER].shot = {
					date: Date.now(),
					value: SHOT_VALUE.TOUCH,
					sunk: false,
				};
			});

			const item: BoardBoxItem = items[4]; // box 5
			const isSunk = boatIsSunk({
				items: _items,
				from: PLAYER.COMPUTER,
				item,
				boatsInGame,
			});

			item.player[PLAYER.COMPUTER].shot = {
				date: Date.now(),
				value: SHOT_VALUE.TOUCH,
				sunk: isSunk,
			};

			expect(item.player[PLAYER.COMPUTER].shot?.sunk).toBe(true);
		});

		test("boat is not sunk (when touch other boat)", () => {
			const positionOfSunkBoat = [1, 2, 3, 4];

			// setting shots¡
			positionOfSunkBoat.forEach((square) => {
				_items[square - 1].player[PLAYER.COMPUTER].shot = {
					date: Date.now(),
					value: SHOT_VALUE.TOUCH,
					sunk: false,
				};
			});

			const item: BoardBoxItem = items[10]; // box 11 (other boat, no sunk)
			const isSunk = boatIsSunk({
				items: _items,
				from: PLAYER.COMPUTER,
				item,
				boatsInGame,
			});

			item.player[PLAYER.COMPUTER].shot = {
				date: Date.now(),
				value: SHOT_VALUE.TOUCH,
				sunk: isSunk,
			};

			expect(item.player[PLAYER.COMPUTER].shot?.sunk).toBe(false);
		});

		test("boat is not sunk (when touch water)", () => {
			const positionOfSunkBoat = [1, 2, 3, 4];

			// setting shots¡
			positionOfSunkBoat.forEach((square) => {
				_items[square - 1].player[PLAYER.COMPUTER].shot = {
					date: Date.now(),
					value: SHOT_VALUE.TOUCH,
					sunk: false,
				};
			});

			const item: BoardBoxItem = items[56]; // box 55 (water)
			const isSunk = boatIsSunk({
				items: _items,
				from: PLAYER.COMPUTER,
				item,
				boatsInGame,
			});

			item.player[PLAYER.COMPUTER].shot = {
				date: Date.now(),
				value: SHOT_VALUE.TOUCH,
				sunk: isSunk,
			};

			expect(item.player[PLAYER.COMPUTER].shot?.sunk).toBe(false);
		});
	});

	describe("Computer player", () => {
		test("boat is sunk", () => {
			const positionOfSunkBoat = [17, 18, 19];

			// setting shots¡
			positionOfSunkBoat.forEach((square) => {
				_items[square - 1].player[PLAYER.HUMAN].shot = {
					date: Date.now(),
					value: SHOT_VALUE.TOUCH,
					sunk: false,
				};
			});

			const item: BoardBoxItem = items[19]; // box 20
			const isSunk = boatIsSunk({
				items: _items,
				from: PLAYER.HUMAN,
				item,
				boatsInGame,
			});

			item.player[PLAYER.HUMAN].shot = {
				date: Date.now(),
				value: SHOT_VALUE.TOUCH,
				sunk: isSunk,
			};

			expect(item.player[PLAYER.HUMAN].shot?.sunk).toBe(true);
		});

		test("boat is not sunk (when touch other boat)", () => {
			const positionOfSunkBoat = [17, 18, 19];

			// setting shots¡
			positionOfSunkBoat.forEach((square) => {
				_items[square - 1].player[PLAYER.HUMAN].shot = {
					date: Date.now(),
					value: SHOT_VALUE.TOUCH,
					sunk: false,
				};
			});

			const item: BoardBoxItem = items[26]; // box 26 (other boat, no sunk)
			const isSunk = boatIsSunk({
				items: _items,
				from: PLAYER.HUMAN,
				item,
				boatsInGame,
			});

			item.player[PLAYER.HUMAN].shot = {
				date: Date.now(),
				value: SHOT_VALUE.TOUCH,
				sunk: isSunk,
			};

			expect(item.player[PLAYER.HUMAN].shot?.sunk).toBe(false);
		});

		test("boat is not sunk (when touch water)", () => {
			const positionOfSunkBoat = [17, 18, 19];

			// setting shots¡
			positionOfSunkBoat.forEach((square) => {
				_items[square - 1].player[PLAYER.HUMAN].shot = {
					date: Date.now(),
					value: SHOT_VALUE.TOUCH,
					sunk: false,
				};
			});

			const item: BoardBoxItem = items[56]; // box 55 (water)
			const isSunk = boatIsSunk({
				items: _items,
				from: PLAYER.HUMAN,
				item,
				boatsInGame,
			});

			item.player[PLAYER.HUMAN].shot = {
				date: Date.now(),
				value: SHOT_VALUE.TOUCH,
				sunk: isSunk,
			};

			expect(item.player[PLAYER.HUMAN].shot?.sunk).toBe(false);
		});
	});
});