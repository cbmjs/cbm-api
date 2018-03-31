require('dotenv').load();
const CallByMeaning = require('../index.js');

const HOST = process.env.HOST || 'https://call-by-meaning.herokuapp.com';

describe('.search()', () => {
	it('throws an error if not supplied at least one argument', () => {
		const cbm = new CallByMeaning(HOST);
		cbm.search().catch(e => expect(e).toBeDefined());
	});

	it('throws an error if supplied with too many arguments', () => {
		const cbm = new CallByMeaning(HOST);
		cbm.search({}, 'a', ['b']).catch(e => expect(e).toBeDefined());
	});

	it('is possible to use search method to find cbmjs functions by params object', async () => {
		const cbm = new CallByMeaning(HOST);
		expect.assertions(2);
		const result = await cbm.search({ outputConcepts: 'time' });
		expect(result.body[0].description).toEqual('Gets the timestamp of the number of milliseconds that have elapsed since the Unix epoch (1 January 1970 00:00:00 UTC).');
		expect(result.statusCode).toEqual(200);
	});

	it('is possible to use search method to find cbmjs functions by providing all properties', async () => {
		const cbm = new CallByMeaning(HOST);
		expect.assertions(2);
		const result = await cbm.search('time');
		expect(result.body[0].description).toEqual('Gets the timestamp of the number of milliseconds that have elapsed since the Unix epoch (1 January 1970 00:00:00 UTC).');
		expect(result.statusCode).toEqual(200);
	});
});
