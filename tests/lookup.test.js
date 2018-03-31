require('dotenv').load();
const CallByMeaning = require('../index.js');

const HOST = process.env.HOST || 'https://call-by-meaning.herokuapp.com';

describe('.lookup()', () => {
	it('throws an error if not supplied at least one argument', () => {
		expect.assertions(1);
		const cbm = new CallByMeaning(HOST);
		return cbm.lookup().catch(e => expect(e).toBeDefined());
	});

	it('throws an error if URI argument is not a string primitive', () => {
		const cbm = new CallByMeaning(HOST);
		const values = [
			function testt() {},
			5,
			true,
			undefined,
			null,
			NaN, [],
			{},
		];

		expect.assertions(values.length);

		for (let i = 0; i < values.length; i += 1) {
			cbm.lookup(values[i]).catch(e => expect(e).toBeDefined());
		}
	});

	it('throws an error if type argument is not one of c, f, r', () => {
		const cbm = new CallByMeaning(HOST);
		const values = [
			function testt() {},
			'5',
			5,
			true,
			undefined,
			null,
			NaN, [],
		];

		expect.assertions(values.length);

		for (let i = 0; i < values.length; i += 1) {
			cbm.lookup('time', values[i]).catch(e => expect(e).toBeDefined());
		}
	});

	it('looks up a single concept', async () => {
		const cbm = new CallByMeaning(HOST);
		const response = await cbm.lookup('string', 'c');
		expect(response.statusCode).toEqual(200);
	});

	it('looks up a single function', async () => {
		const cbm = new CallByMeaning(HOST);
		const response = await cbm.lookup('add', 'f');
		expect(response.statusCode).toEqual(200);
	});

	it('looks up a single relation', async () => {
		const cbm = new CallByMeaning(HOST);
		const response = await cbm.lookup('unitConversion', 'r');
		expect(response.statusCode).toEqual(200);
	});

	it('looks up a single concept without specified \'c\' type', async () => {
		const cbm = new CallByMeaning(HOST);
		const response = await cbm.lookup('function');
		expect(response.statusCode).toEqual(200);
	});

	it('looks up a single function without specified \'f\' type', async () => {
		const cbm = new CallByMeaning(HOST);
		const response = await cbm.lookup('now');
		expect(response.statusCode).toEqual(200);
	});

	it('looks up a single relation without specified \'r\' type', async () => {
		const cbm = new CallByMeaning(HOST);
		const response = await cbm.lookup('unitConversion');
		expect(response.statusCode).toEqual(200);
	});

	it('returns correctly if it can\'t find the object in the server (with specified type)', async () => {
		const cbm = new CallByMeaning();
		expect.assertions(6);
		let response = await cbm.lookup('blabla', 'c');
		expect(response.statusCode).toEqual(418);
		expect(response.body).toBeInstanceOf(Object);
		response = await cbm.lookup('blabla', 'f');
		expect(response.statusCode).toEqual(418);
		expect(response.body).toBeInstanceOf(Object);
		response = await cbm.lookup('blabla', 'r');
		expect(response.statusCode).toEqual(418);
		expect(response.body).toBeInstanceOf(Object);
	});

	it('returns correctly if it can\'t find the object in the server (without specified type)', async () => {
		const cbm = new CallByMeaning();
		const response = await cbm.lookup('blabla');
		expect(response.statusCode).toEqual(418);
		expect(response.body).toBeInstanceOf(Object);
	});
});
