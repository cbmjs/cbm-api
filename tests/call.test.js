require('dotenv').load();
const CallByMeaning = require('../index.js');

const HOST = process.env.HOST || 'https://call-by-meaning.herokuapp.com';

describe('.call()', () => {
	it('throws an error if not supplied at least one argument', () => {
		const cbm = new CallByMeaning(HOST);
		cbm.call().catch(e => expect(e).toBeDefined());
	});

	it('throws an error if supplied with too many arguments', () => {
		const cbm = new CallByMeaning(HOST);
		cbm.call(1, 2, 3, 4, 5, 6, 7, 8).catch(e => expect(e).toBeDefined());
	});

	it('is possible to retrieve results (params)', async () => {
		const cbm = new CallByMeaning(HOST);
		const response = await cbm.call({ outputConcepts: 'time', outputUnits: 'milliseconds' });
		expect(response.statusCode).toEqual(200);
	});

	it('is possible to retrieve results (many args)', async () => {
		const cbm = new CallByMeaning(HOST);
		const response = await cbm.call('time', 'milliseconds');
		expect(response.statusCode).toEqual(200);
	});

	it('is possible to retrieve results (many args) when returnCode === false', async () => {
		const cbm = new CallByMeaning(HOST);
		const response = await cbm.call('date', null, [new Date()], 'time', 'milliseconds', false);
		expect(response.statusCode).toEqual(200);
	});

	it('is possible to retrieve code (params)', async () => {
		const cbm = new CallByMeaning(HOST);
		const response = await cbm.call({ outputConcepts: 'time', outputUnits: 'milliseconds' }, true);
		expect(response.statusCode).toEqual(200);
	});

	it('is possible to retrieve code (many args)', async () => {
		const cbm = new CallByMeaning(HOST);
		const response = await cbm.call('date', null, 'time', 'milliseconds', true);
		expect(response.statusCode).toEqual(200);
	});

	it('is possible to retrieve results with different units', async () => {
		const cbm = new CallByMeaning(HOST);
		expect.assertions(3);
		const response = await cbm.call({ outputConcepts: 'time', outputUnits: 'milliseconds' });
		const response2 = await cbm.call('time', 'milliseconds');
		expect(response.statusCode).toEqual(response2.statusCode);
		expect(response.statusCode).toEqual(200);
		expect(response2.body - (3600000 * response.body)).toBeLessThan(2000);
	});
});
