import { setVerticalBoatPosition } from ".";

describe("[Method]: setVerticalBoatPosition", () => {
	test("boat should be set in vertical numbers", () => {
		const initialBox = 55;
		const boatSize = 5;

		expect(setVerticalBoatPosition(initialBox, boatSize))
			.toStrictEqual([35, 45, 55, 65, 75]);
	});

	test("when the initial number is close to left border", () => {
		const initialBox = 5;
		const boatSize = 5;

		expect(setVerticalBoatPosition(initialBox, boatSize))
			.toStrictEqual([5, 15, 25, 35, 45]);
	});

	test("when the initial number is close to rigth border", () => {
		const initialBox = 95;
		const boatSize = 5;

		expect(setVerticalBoatPosition(initialBox, boatSize))
			.toStrictEqual([55, 65, 75, 85, 95]);
	});
});