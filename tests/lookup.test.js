require("dotenv").config();
const test = require("ava");

const CallByMeaning = require("..");

const HOST = process.env.HOST || "https://call-by-meaning.herokuapp.com";

test("throws an error if not supplied at least one argument", async (t) => {
	const cbm = new CallByMeaning(HOST);
	await t.throwsAsync(cbm.lookup());
});

test("throws an error if URI argument is not a string primitive", async (t) => {
	const cbm = new CallByMeaning(HOST);
	const values = [
		() => {},
		5,
		true,
		undefined,
		null,
		Number.NaN,
		[],
		{},
	];

	t.plan(values.length);
	const tests = [];
	for (const i of values) tests.push(t.throwsAsync(cbm.lookup(i)));
	await Promise.all(tests);
});

test("throws an error if type argument is not one of c, f, r", async (t) => {
	const cbm = new CallByMeaning(HOST);
	const values = [
		() => {},
		"5",
		5,
		true,
		undefined,
		null,
		Number.NaN,
		[],
	];

	t.plan(values.length);
	const tests = [];
	for (const i of values) tests.push(t.throwsAsync(cbm.lookup("time", i)));
	await Promise.all(tests);
});

test("looks up a single concept", async (t) => {
	const cbm = new CallByMeaning(HOST);
	const response = await cbm.lookup("string", "c");
	t.is(response.statusCode, 200);
});

test("looks up a single function", async (t) => {
	const cbm = new CallByMeaning(HOST);
	const response = await cbm.lookup("add", "f");
	t.is(response.statusCode, 200);
});

test("looks up a single relation", async (t) => {
	const cbm = new CallByMeaning(HOST);
	const response = await cbm.lookup("unitConversion", "r");
	t.is(response.statusCode, 200);
});

test("looks up a single concept without specified `c` type", async (t) => {
	const cbm = new CallByMeaning(HOST);
	const response = await cbm.lookup("function");
	t.is(response.statusCode, 200);
});

test("looks up a single function without specified `f` type", async (t) => {
	const cbm = new CallByMeaning(HOST);
	const response = await cbm.lookup("now");
	t.is(response.statusCode, 200);
});

test("looks up a single relation without specified `r` type", async (t) => {
	const cbm = new CallByMeaning(HOST);
	const response = await cbm.lookup("unitConversion");
	t.is(response.statusCode, 200);
});

test("returns correctly if test can’t find the object in the server (with specified type)", async (t) => {
	const cbm = new CallByMeaning();
	t.plan(6);
	let response = await cbm.lookup("blabla", "c");
	t.is(response.statusCode, 418);
	t.true(response.body instanceof Object);
	response = await cbm.lookup("blabla", "f");
	t.is(response.statusCode, 418);
	t.true(response.body instanceof Object);
	response = await cbm.lookup("blabla", "r");
	t.is(response.statusCode, 418);
	t.true(response.body instanceof Object);
});

test("returns correctly if test can’t find the object in the server (without specified type)", async (t) => {
	const cbm = new CallByMeaning();
	const response = await cbm.lookup("blabla");
	t.is(response.statusCode, 418);
	t.true(response.body instanceof Object);
});
