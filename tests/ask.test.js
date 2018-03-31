require('dotenv').load();
const CallByMeaning = require('../index.js');

const HOST = process.env.HOST || 'https://call-by-meaning.herokuapp.com';

describe('.ask()', () => {
	it('throws an error if supplied with more than one argument', () => {
		const cbm = new CallByMeaning();
		cbm.ask('now.js', 5).catch(e => expect(e).toBeDefined());
	});

	it('throws an error if argument is not a string primitive', () => {
		const cbm = new CallByMeaning(HOST);
		const values = [
			function testt() { },
			5,
			true,
			undefined,
			null,
			NaN, [],
			{},
		];

		expect.assertions(values.length);

		for (let i = 0; i < values.length; i += 1) {
			cbm.ask(i).catch(e => expect(e).toBeDefined());
		}
	});

	it('is possible to use ask method to find cbmjs functions with outputs only', async () => {
		const cbm = new CallByMeaning(HOST);
		expect.assertions(2);
		const result = await cbm.ask('Give me all functions that return time');
		expect(result.body[0].description).toEqual('Gets the timestamp of the number of milliseconds that have elapsed since the Unix epoch (1 January 1970 00:00:00 UTC).');
		expect(result.statusCode).toEqual(200);
	});

	it('is possible to use ask method to find cbmjs functions with both inputs and outputs', async () => {
		const cbm = new CallByMeaning(HOST);
		expect.assertions(2);
		const result = await cbm.ask('Return all functions that take a date and convert it to time');
		expect(result.body[0].description).toEqual('Gets a date and retuns the timestamp of the number of seconds that have elapsed from that date since the Unix epoch (1 January 1970 00:00:00 UTC).');
		expect(result.statusCode).toEqual(200);
	});

	it('returns correctly if function does not exist', async () => {
		const cbm = new CallByMeaning();
		const result = await cbm.ask('Give me all functions that');
		expect(result.statusCode).toEqual(400);
	});
});
