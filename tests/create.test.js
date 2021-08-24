import "dotenv/config";

import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

import test from "ava";
import got from "got";

import CallByMeaning from "../index.js";

const HOST = process.env.HOST || "https://call-by-meaning.herokuapp.com";

test.after.always(async () => {
	const cbm = new CallByMeaning(HOST);
	const path = `${cbm.host}/new/fix`;
	await got.post(path, { form: { command: "fixtests" } });
	await got.post(path, { form: { command: "fixit" } });
});

test("throws an error if not supplied at least one argument", async (t) => {
	const cbm = new CallByMeaning(HOST);
	await t.throwsAsync(cbm.create());
});

test("throws an error if params argument is not an object", async (t) => {
	const cbm = new CallByMeaning(HOST);
	const values = [
		() => {},
		5,
		true,
		undefined,
		Number.NaN,
		"test",
	];

	t.plan(values.length);
	const tests = [];
	for (const i of values) tests.push(t.throwsAsync(cbm.create(i)));
	await Promise.all(tests);
});

test("throws an error if type argument is not one of concept, function, relation", async (t) => {
	const cbm = new CallByMeaning();
	const values = [
		() => {},
		"5",
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
	for (const i of values) tests.push(t.throwsAsync(cbm.create({ name: "Napo" }, i)));
	await Promise.all(tests);
});

test("creates a single Concept", async (t) => {
	const cbm = new CallByMeaning(HOST);
	const result = await cbm.create({ name: "Napo", units: "cool guy" }, "concept");
	t.true(result);
});

test("creates a single Function", async (t) => {
	const cbm = new CallByMeaning(HOST);
	const result = await cbm.create({
		name: "testFunc", argsNames: "Napo", argsUnits: "napo", returnsNames: "nApo", returnsUnits: "naPo",
	}, "function");
	t.true(result);
});

test("creates a single async Function with existing file", async (t) => {
	const cbm = new CallByMeaning(HOST);
	const result = await cbm.create({
		name: "jsonfn", argsNames: "Napo", argsUnits: "napo", returnsNames: "nApo", returnsUnits: "naPo", codeFile: `${dirname(fileURLToPath(import.meta.url))}/../lib/jsonfn.js`,
	}, "function");
	t.true(result);
});

test("create a single async Function with existing file but not name returns correctly", async (t) => {
	const cbm = new CallByMeaning(HOST);
	const result = await cbm.create({ codeFile: `${dirname(fileURLToPath(import.meta.url))}/../lib/jsonfn.js` }, "function");
	t.false(result);
});

test("creates a single Function with non-existing file", async (t) => {
	const cbm = new CallByMeaning(HOST);
	const result = await cbm.create({ name: "jsonfn" }, "function");
	t.true(result);
});

test("creates a single Relation", async (t) => {
	const cbm = new CallByMeaning(HOST);
	const result = await cbm.create({ name: "testRel" }, "relation");
	t.true(result);
});

test("creates a single Concept if no type specified", async (t) => {
	const cbm = new CallByMeaning(HOST);
	const result = await cbm.create({ name: "Mary" });
	t.true(result);
});

test("returns correctly if test can’t create the concept in the server (with specified type)", async (t) => {
	const cbm = new CallByMeaning(HOST);
	const result = await cbm.create({ desc: "blabla" }, "concept");
	t.false(result);
});

test("returns correctly if test can’t create the concept in the server (without specified type)", async (t) => {
	const cbm = new CallByMeaning(HOST);
	const result = await cbm.create({ desc: "blabla" });
	t.false(result);
});

test("returns correctly if test can’t create the function in the server", async (t) => {
	const cbm = new CallByMeaning(HOST);
	const result = await cbm.create({ desc: "blabla" }, "function");
	t.false(result);
});

test("returns correctly if test can’t create the relation in the server", async (t) => {
	const cbm = new CallByMeaning(HOST);
	const result = await cbm.create({ desc: "blabla" }, "relation");
	t.false(result);
});
