import test from 'ava';

require('dotenv').load();
const CallByMeaning = require('..');

const HOST = process.env.HOST || 'https://call-by-meaning.herokuapp.com';

test('throws an error if supplied with more than one argument', async t => {
	const cbm = new CallByMeaning();
	await t.throws(cbm.getCode('now.js', 5));
});

test('throws an error if argument is not a string primitive', async t => {
	const cbm = new CallByMeaning(HOST);
	const values = [
		() => {},
		5,
		true,
		undefined,
		null,
		NaN,
		[],
		{}
	];

	t.plan(values.length);
	const tests = [];
	for (const i of values) {
		tests.push(t.throws(cbm.getCode(i)));
	}
	await Promise.all(tests);
});

test('is possible to retrieve code if input is a path', async t => {
	const cbm = new CallByMeaning(HOST);
	const result = await cbm.getCode('./js/now.js');
	t.regex(result, /module\.exports/);
});

test('is possible to retrieve code if input is filename', async t => {
	const cbm = new CallByMeaning(HOST);
	const result = await cbm.getCode('now.js');
	t.regex(result, /module\.exports/);
});
