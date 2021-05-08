import "dotenv/config";

import test from "ava";

import CallByMeaning from "../index.js";

const HOST = process.env.HOST || "https://call-by-meaning.herokuapp.com";

test("throws an error if supplied with more than one argument", async (t) => {
	const cbm = new CallByMeaning();
	await t.throwsAsync(cbm.ask("now.js", 5));
});

test("throws an error if argument is not a string primitive", async (t) => {
	const cbm = new CallByMeaning(HOST);
	const values = [
		() => {},
		5,
		true,
		[],
		{},
	];

	t.plan(values.length);
	const tests = [];
	for (const i of values) tests.push(t.throwsAsync(cbm.ask(i)));
	await Promise.all(tests);
});

test("is possible to use ask method to find cbmjs functions with outputs only", async (t) => {
	const cbm = new CallByMeaning(HOST);
	t.plan(2);
	const result = await cbm.ask("Give me all functions that return time");
	t.is(result.body[0].description,
		"Gets the timestamp of the number of milliseconds that have elapsed since the Unix epoch (1 January 1970 00:00:00 UTC).");
	t.is(result.statusCode, 200);
});

test("is possible to use ask method to find cbmjs functions with both inputs and outputs", async (t) => {
	const cbm = new CallByMeaning(HOST);
	t.plan(2);
	const result = await cbm.ask("Return all functions that take a date and convert it to time");
	t.is(result.body[0].description,
		"Gets a date and retuns the timestamp of the number of seconds that have elapsed from that date"
    + " since the Unix epoch (1 January 1970 00:00:00 UTC).");
	t.is(result.statusCode, 200);
});

test("returns correctly if function does not exist", async (t) => {
	const cbm = new CallByMeaning();
	const result = await cbm.ask("Give me all functions that");
	t.is(result.statusCode, 400);
});
