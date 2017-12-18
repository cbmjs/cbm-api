require('dotenv').load();
const request = require('sync-request');
const CallByMeaning = require('../index.js');

const TIMEOUT = 10000;
const HOST = process.env.HOST || 'https://call-by-meaning.herokuapp.com';

describe('CallByMeaning', () => {
  afterAll(() => {
    const cbm = new CallByMeaning(HOST);
    const path = cbm.host.concat('/new/fix');
    request('post', path, { json: { command: 'fixtests' } });
    request('post', path, { json: { command: 'fixit' } });
  });
  describe('Initial config', () => {
    it('creates an instance of CallByMeaning', () => {
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

    it('looks up the CallByMeaning URI for text', () => {
      const cbm = new CallByMeaning(HOST);
      const result = cbm.getURI('a big    ,  !!  dog!');
      expect(result).toEqual('big_dog');
    });
  });

  describe('.search()', () => {
    it('throws an error if not supplied at least one argument', () => {
      const cbm = new CallByMeaning(HOST);
      cbm.search().catch(e => expect(e).toBeDefined());
    });

    it('throws an error if supplied with too many arguments', () => {
      const cbm = new CallByMeaning(HOST);
      cbm.search({}, 'a', ['b']).catch(e => expect(e).toBeDefined());
    });

    it('is possible to use search method to find CallByMeaning functions by params object', async () => {
      const cbm = new CallByMeaning(HOST);
      expect.assertions(2);
      const result = await cbm.search({ outputNodes: 'time' });
      expect(result.body[0].description).toEqual('Gets the timestamp of the number of milliseconds that have elapsed since the Unix epoch (1 January 1970 00:00:00 UTC).');
      expect(result.statusCode).toEqual(200);
    });

    it('is possible to use search method to find CallByMeaning functions by providing all properties', async () => {
      const cbm = new CallByMeaning(HOST);
      expect.assertions(2);
      const result = await cbm.search('time');
      expect(result.body[0].description).toEqual('Gets the timestamp of the number of milliseconds that have elapsed since the Unix epoch (1 January 1970 00:00:00 UTC).');
      expect(result.statusCode).toEqual(200);
    });
  });

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
      const response = await cbm.call({ outputNodes: 'time', outputUnits: 'milliseconds' });
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
      const response = await cbm.call({ outputNodes: 'time', outputUnits: 'milliseconds' }, true);
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
      const response = await cbm.call({ outputNodes: 'time', outputUnits: 'milliseconds' });
      const response2 = await cbm.call('time', 'milliseconds');
      expect(response.statusCode).toEqual(response2.statusCode);
      expect(response.statusCode).toEqual(200);
      expect(response2.body - (3600000 * response.body)).toBeLessThan(2000);
    });
  });

  describe('.getCode()', () => {
    it('throws an error if supplied with more than one argument', () => {
      const cbm = new CallByMeaning();
      expect(() => cbm.getCode('now.js', 5)).toThrow(Error);
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
        expect(() => cbm.getCode(i)).toThrow(TypeError);
      }
    });

    it('is possible to retrieve code if input is a path', () => {
      const cbm = new CallByMeaning(HOST);
      const result = cbm.getCode('./js/now.js');
      expect(result).toEqual(expect.stringContaining('module.exports'));
    });

    it('is possible to retrieve code if input is filename', () => {
      const cbm = new CallByMeaning(HOST);
      const result = cbm.getCode('now.js');
      expect(result).toEqual(expect.stringContaining('module.exports'));
    });
  });

  describe('.create()', () => {
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

    it('throws an error if type argument is not one of node, function, relation', () => {
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

    it('creates a single Node', async () => {
      const cbm = new CallByMeaning(HOST);
      const result = await cbm.create({ name: 'Napo', units: 'cool guy' }, 'node');
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


    it('creates a single Node if no type specified', async () => {
      const cbm = new CallByMeaning(HOST);
      const result = await cbm.create({ name: 'Mary' });
      expect(result).toBeTruthy();
    }, TIMEOUT);

    it('returns correctly if it can\'t create the node in the server (with specified type)', async () => {
      const cbm = new CallByMeaning(HOST);
      const result = await cbm.create({ desc: 'blabla' }, 'node');
      expect(result).toBeFalsy();
    }, TIMEOUT);

    it('returns correctly if it can\'t create the node in the server (without specified type)', async () => {
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
});
