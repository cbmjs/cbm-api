import test from 'ava';

require('dotenv').load();
const CallByMeaning = require('..');

const HOST = process.env.HOST || 'https://call-by-meaning.herokuapp.com';

test('throws an error if not supplied at least one argument', async t => {
	const cbm = new CallByMeaning(HOST);
	await t.throws(cbm.search());
});

test('throws an error if supplied with too many arguments', async t => {
	const cbm = new CallByMeaning(HOST);
	await t.throws(cbm.search({}, 'a', ['b']));
});

test('is possible to use search method to find cbmjs functions by params object', async t => {
	const cbm = new CallByMeaning(HOST);
	t.plan(2);
	const result = await cbm.search({outputConcepts: 'time'});
	t.is(result.body[0].description, 'Gets the timestamp of the number of milliseconds that have elapsed since the Unix epoch (1 January 1970 00:00:00 UTC).');
	t.is(result.statusCode, 200);
});

test('is possible to use search method to find cbmjs functions by providing all properties', async t => {
	const cbm = new CallByMeaning(HOST);
	t.plan(2);
	const result = await cbm.search('time');
	t.is(result.body[0].description, 'Gets the timestamp of the number of milliseconds that have elapsed since the Unix epoch (1 January 1970 00:00:00 UTC).');
	t.is(result.statusCode, 200);
});
