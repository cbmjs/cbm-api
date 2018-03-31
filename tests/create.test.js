require('dotenv').load();
const got = require('got');
const CallByMeaning = require('../index.js');

const TIMEOUT = 10000;
const HOST = process.env.HOST || 'https://call-by-meaning.herokuapp.com';

describe('.create()', () => {
	afterAll(async () => {
		const cbm = new CallByMeaning(HOST);
		const path = cbm.host.concat('/new/fix');
		await got.post(path, { body: { command: 'fixtests' }, form: true });
		await got.post(path, { body: { command: 'fixit' }, form: true });
	});
	it('throws an error if not supplied at least one argument', () => {
		const cbm = new CallByMeaning(HOST);
		cbm.create().catch(e => expect(e).toBeDefined());
	});

	it('throws an error if params argument is not an object', () => {
		const cbm = new CallByMeaning(HOST);
		const values = [
			function testt() { },
			5,
			true,
			undefined,
			NaN,
			'test',
		];

		expect.assertions(values.length);

		for (let i = 0; i < values.length; i += 1) {
			cbm.create('time').catch(e => expect(e).toBeDefined());
		}
	});

	it('throws an error if type argument is not one of concept, function, relation', () => {
		const cbm = new CallByMeaning();
		const values = [
			function testt() { },
			'5',
			5,
			true,
			undefined,
			null,
			NaN, [],
			{},
		];

		expect.assertions(values.length);

		for (let i = 0; i < values.length; i += 1) {
			cbm.create({ name: 'Napo' }, values[i]).catch(e => expect(e).toBeDefined());
		}
	});

	it('creates a single Concept', async () => {
		const cbm = new CallByMeaning(HOST);
		const result = await cbm.create({ name: 'Napo', units: 'cool guy' }, 'concept');
		expect(result).toBeTruthy();
	}, TIMEOUT);

	it('creates a single Function', async () => {
		const cbm = new CallByMeaning(HOST);
		const result = await cbm.create({
			name: 'testFunc', argsNames: 'Napo', argsUnits: 'napo', returnsNames: 'nApo', returnsUnits: 'naPo',
		}, 'function');
		expect(result).toBeTruthy();
	}, TIMEOUT);

	it('creates a single async Function with existing file', async () => {
		const cbm = new CallByMeaning(HOST);
		const result = await cbm.create({
			name: 'jsonfn', argsNames: 'Napo', argsUnits: 'napo', returnsNames: 'nApo', returnsUnits: 'naPo', codeFile: __dirname.concat('/../lib/jsonfn.js'),
		}, 'function');
		expect(result).toBeTruthy();
	}, TIMEOUT);

	it('create a single async Function with existing file but not name returns correctly', async () => {
		const cbm = new CallByMeaning(HOST);
		const result = await cbm.create({ codeFile: __dirname.concat('/../lib/jsonfn.js') }, 'function');
		expect(result).toBeFalsy();
	}, TIMEOUT);

	it('creates a single Function with non-existing file', async () => {
		const cbm = new CallByMeaning(HOST);
		const result = await cbm.create({ name: 'jsonfn' }, 'function');
		expect(result).toBeTruthy();
	}, TIMEOUT);

	it('creates a single Relation', async () => {
		const cbm = new CallByMeaning(HOST);
		const result = await cbm.create({ name: 'testRel' }, 'relation');
		expect(result).toBeTruthy();
	}, TIMEOUT);


	it('creates a single Concept if no type specified', async () => {
		const cbm = new CallByMeaning(HOST);
		const result = await cbm.create({ name: 'Mary' });
		expect(result).toBeTruthy();
	}, TIMEOUT);

	it('returns correctly if it can\'t create the concept in the server (with specified type)', async () => {
		const cbm = new CallByMeaning(HOST);
		const result = await cbm.create({ desc: 'blabla' }, 'concept');
		expect(result).toBeFalsy();
	}, TIMEOUT);

	it('returns correctly if it can\'t create the concept in the server (without specified type)', async () => {
		const cbm = new CallByMeaning(HOST);
		const result = await cbm.create({ desc: 'blabla' });
		expect(result).toBeFalsy();
	}, TIMEOUT);

	it('returns correctly if it can\'t create the function in the server', async () => {
		const cbm = new CallByMeaning(HOST);
		const result = await cbm.create({ desc: 'blabla' }, 'function');
		expect(result).toBeFalsy();
	}, TIMEOUT);

	it('returns correctly if it can\'t create the relation in the server', async () => {
		const cbm = new CallByMeaning(HOST);
		const result = await cbm.create({ desc: 'blabla' }, 'relation');
		expect(result).toBeFalsy();
	}, TIMEOUT);
});
