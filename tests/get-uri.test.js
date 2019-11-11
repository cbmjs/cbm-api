import test from "ava";

require("dotenv").config();
const CallByMeaning = require("..");

const HOST = process.env.HOST || "https://call-by-meaning.herokuapp.com";

test("throws an error if supplied with more than one argument", (t) => {
	const cbm = new CallByMeaning();
	t.throws(() => cbm.getURI("big dog", 5));
});

test("throws an error if argument is not a string primitive", (t) => {
	const cbm = new CallByMeaning(HOST);
	const values = [
		() => {},
		5,
		true,
		[],
		{},
	];

	t.plan(values.length);
	values.forEach((i) => t.throws(() => cbm.getURI(i)));
});

test("looks up the cbmjs URI for text", (t) => {
	const cbm = new CallByMeaning(HOST);
	const result = cbm.getURI("a big    ,  !!  dog!");
	t.is(result, "big_dog");
});
