import { setHorizontalBoatPosition } from ".";

describe("[Method]: setHorizontalBoatPosition", () => {
	test("boat should be set in horizontal numbers", () => {
		const initialBox = 55;
		const boatSize = 5;

		expect(setHorizontalBoatPosition(initialBox, boatSize))
			.toStrictEqual([53, 54, 55, 56, 57]);
	});

	test("when the initial number is close to left border", () => {
		const initialBox = 51;
		const boatSize = 5;

		expect(setHorizontalBoatPosition(initialBox, boatSize))
			.toStrictEqual([51, 52, 53, 54, 55]);
	});

	test("when the initial number is close to rigth border", () => {
		const initialBox = 60;
		const boatSize = 5;

		expect(setHorizontalBoatPosition(initialBox, boatSize))
			.toStrictEqual([56, 57, 58, 59, 60]);
	});
});