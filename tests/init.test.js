require('dotenv').load();
const CallByMeaning = require('../index.js');

const HOST = process.env.HOST || 'https://call-by-meaning.herokuapp.com';

describe('Initial config', () => {
	it('creates an instance of cbm-api', () => {
		const cbm = new CallByMeaning(HOST);
		expect(cbm).toBeInstanceOf(CallByMeaning);
	});

	it('can\'t be invoked without new', () => {
		expect(() => CallByMeaning(HOST)).toThrow(TypeError);
	});

	describe('defaults', () => {
		it('has default hostname', () => {
			const cbm = new CallByMeaning();
			expect(cbm.host).toEqual('https://call-by-meaning.herokuapp.com');
		});
	});

	describe('override', () => {
		it('has set hostname', () => {
			const cbm = new CallByMeaning('10.0.0.1');
			expect(cbm.host).toEqual('10.0.0.1');
		});
	});
});
