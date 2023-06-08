import { createArray } from ".";

describe("[Method]: createArray", () => {
	test("create an array", () => {
		expect(createArray(99)).toHaveLength(99);
	});
});