require('dotenv').load();
const CallByMeaning = require('../index.js');

const HOST = process.env.HOST || 'https://call-by-meaning.herokuapp.com';

describe('.getCode()', () => {
	it('throws an error if supplied with more than one argument', () => {
		const cbm = new CallByMeaning();
		cbm.getCode('now.js', 5).catch(e => expect(e).toBeDefined());
	});

	it('throws an error if argument is not a string primitive', () => {
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
			cbm.getCode(i).catch(e => expect(e).toBeDefined());
		}
	});

	it('is possible to retrieve code if input is a path', async () => {
		const cbm = new CallByMeaning(HOST);
		const result = await cbm.getCode('./js/now.js');
		expect(result).toEqual(expect.stringContaining('module.exports'));
	});

	it('is possible to retrieve code if input is filename', async () => {
		const cbm = new CallByMeaning(HOST);
		const result = await cbm.getCode('now.js');
		expect(result).toEqual(expect.stringContaining('module.exports'));
	});
});
