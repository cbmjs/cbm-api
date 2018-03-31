require('dotenv').load();
const CallByMeaning = require('../index.js');

const HOST = process.env.HOST || 'https://call-by-meaning.herokuapp.com';

describe('.getURI()', () => {
	it('throws an error if supplied with more than one argument', () => {
		const cbm = new CallByMeaning();
		expect(() => cbm.getURI('big dog', 5)).toThrow(Error);
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
			expect(() => cbm.getURI(i)).toThrow(TypeError);
		}
	});

	it('looks up the cbmjs URI for text', () => {
		const cbm = new CallByMeaning(HOST);
		const result = cbm.getURI('a big    ,  !!  dog!');
		expect(result).toEqual('big_dog');
	});
});
