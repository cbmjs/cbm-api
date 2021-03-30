require("dotenv").config();
const test = require("ava");

const CallByMeaning = require("..");

const HOST = process.env.HOST || "https://call-by-meaning.herokuapp.com";

test("throws an error if not supplied at least one argument", async (t) => {
	const cbm = new CallByMeaning(HOST);
	await t.throwsAsync(cbm.call());
});

test("throws an error if supplied with too many arguments", async (t) => {
	const cbm = new CallByMeaning(HOST);
	await t.throwsAsync(cbm.call(1, 2, 3, 4, 5, 6, 7, 8));
});

test("is possible to retrieve results (params)", async (t) => {
	const cbm = new CallByMeaning(HOST);
	const response = await cbm.call({ outputConcepts: "time", outputUnits: "milliseconds" });
	t.is(response.statusCode, 200);
});

test("is possible to retrieve results (many args)", async (t) => {
	const cbm = new CallByMeaning(HOST);
	const response = await cbm.call("time", "milliseconds");
	t.is(response.statusCode, 200);
});

test("is possible to retrieve results (many args) when returnCode === false", async (t) => {
	const cbm = new CallByMeaning(HOST);
	const response = await cbm.call("date", null, [new Date()], "time", "milliseconds", false);
	t.is(response.statusCode, 200);
});

test("is possible to retrieve code (params)", async (t) => {
	const cbm = new CallByMeaning(HOST);
	const response = await cbm.call({ outputConcepts: "time", outputUnits: "milliseconds" }, true);
	t.is(response.statusCode, 200);
});

test("is possible to retrieve code (many args)", async (t) => {
	const cbm = new CallByMeaning(HOST);
	const response = await cbm.call("date", null, "time", "milliseconds", true);
	t.is(response.statusCode, 200);
});

test("is possible to retrieve results with different units", async (t) => {
	const cbm = new CallByMeaning(HOST);
	t.plan(3);
	const response = await cbm.call({ outputConcepts: "time", outputUnits: "milliseconds" });
	const response2 = await cbm.call("time", "milliseconds");
	t.is(response.statusCode, response2.statusCode);
	t.is(response.statusCode, 200);
	t.true(response2.body - (3_600_000 * response.body) < 2000);
});
