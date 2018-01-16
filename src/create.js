const rp = require('request-promise');
const fs = require('fs');
const getURI = require('./getURI');

async function createConcept(params, host) {
  const path = host.concat('/new/concept');
  if (params.name == null) return false;
  const res = await rp.post(path, {
    json: {
      name: getURI(params.name),
      desc: params.desc,
      units: [].concat(params.units).map(el => getURI(el)),
    },
    resolveWithFullResponse: true,
  });
  return res.statusCode === 200;
}

async function createFunction(params, host) {
  const path = host.concat('/new/function');
  if (params.name == null) return false;
  const res = await rp.post(path, {
    json: {
      name: params.name,
      desc: params.desc,
      argsNames: [].concat(params.argsNames).map(el => getURI(el)),
      argsUnits: [].concat(params.argsUnits).map(el => getURI(el)),
      returnsNames: [].concat(params.returnsNames).map(el => getURI(el)),
      returnsUnits: [].concat(params.returnsUnits).map(el => getURI(el)),
    },
    resolveWithFullResponse: true,
  });
  return res.statusCode === 200;
}

async function createAsyncFunction(params, callPath, host) {
  const path = host.concat('/new/function');
  if (params.name == null) return false;
  const fullParams = {
    name: '',
    desc: '',
    argsNames: [],
    argsUnits: [],
    returnsNames: [],
    returnsUnits: [],
    codeFile: '',
  };
  Object.assign(fullParams, params);
  const res = await rp.post({
    uri: path,
    formData: {
      name: fullParams.name,
      desc: fullParams.desc,
      argsNames: [].concat(fullParams.argsNames).map(el => getURI(el)),
      argsUnits: [].concat(fullParams.argsUnits).map(el => getURI(el)),
      returnsNames: [].concat(fullParams.returnsNames).map(el => getURI(el)),
      returnsUnits: [].concat(fullParams.returnsUnits).map(el => getURI(el)),
      codeFile: fs.createReadStream(fullParams.codeFile),
    },
    resolveWithFullResponse: true,
  });
  await rp.post(callPath, { json: { command: 'fixit' } });
  return res.statusCode === 200;
}

async function createRelation(params, host) {
  const path = host.concat('/new/relation');
  if (params.name == null) return false;
  const res = await rp.post(path, {
    json: {
      name: params.name,
      desc: params.desc,
      start: getURI(params.start),
      end: getURI(params.end),
      mathRelation: params.mathRelation,
    },
    resolveWithFullResponse: true,
  });
  return res.statusCode === 200;
}

async function create(...args) {
  const nargs = args.length;
  let type;

  if (nargs < 1) {
    throw new Error('Insufficient input arguments. Must provide a params object.');
  }
  const params = args[0];
  if (typeof params !== 'object' || params == null) {
    throw new TypeError('Invalid input argument. Argument must be an object.');
  }

  if (nargs < 2) {
    type = 'concept';
  } else {
    type = args[1];
    if ((!(typeof type === 'string') || (['concept', 'function', 'relation'].indexOf(type) === -1))) {
      throw new TypeError(`Invalid input argument. type argument must be one of 'concept', 'function', 'relation'. Value: \`${type}\`.`);
    }
  }

  const path = this.host.concat('/new/fix');
  if (!(params.codeFile == null || params.codeFile.length === 0)) {
    return createAsyncFunction(params, path, this.host);
  }
  let created = false;
  if (type === 'concept') created = createConcept(params, this.host);
  if (type === 'function') created = createFunction(params, this.host);
  if (type === 'relation') created = createRelation(params, this.host);
  await rp.post(path, { json: { command: 'fixit' } });
  return created;
}

module.exports = create;
