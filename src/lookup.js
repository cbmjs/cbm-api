const request = require('request-promise');

async function lookup(...args) {
  const nargs = args.length;
  let type;

  if (nargs < 1) {
    throw new Error('Insufficient input arguments. Must provide a CallByMeaning URI.');
  }

  const uri = args[0];
  if (!(typeof uri === 'string')) {
    throw new TypeError(`Invalid input argument. First argument must be a string primitive. Value: \`${uri}\`.`);
  }

  if (nargs < 2) {
    type = 'all';
  } else {
    type = args[1];
    if ((!(typeof uri === 'string') || (['c', 'f', 'r'].indexOf(type) === -1))) {
      throw new TypeError(`Invalid input argument. type argument must be one of 'c', 'f', 'r'. Value: \`${type}\`.`);
    }
  }

  if (type !== 'all') {
    const path = `/gbn/${type}/${String(encodeURIComponent(uri))}`;
    const response = await request.get({
      uri: this.fullAddress_(path),
      json: true,
      resolveWithFullResponse: true,
      simple: false,
    });
    if (response.statusCode === 200) {
      let result;
      switch (type) {
        case 'c':
          result = {
            name: response.body.name,
            description: response.body.desc,
            units: response.body.units,
            asInput: response.body.func_arg.map(obj => Object({ name: obj.name, unit: obj.unitType })),
            asOutput: response.body.func_res.map(obj => Object({ name: obj.name, unit: obj.unitType })),
          };
          break;
        case 'f':
          result = {
            name: response.body.name,
            description: response.body.desc,
            units: response.body.units,
            argsNames: response.body.argsNames,
            argsUnits: response.body.argsUnits,
            returnsNames: response.body.returnsNames,
            returnsUnits: response.body.returnsUnits,
            sourceCode: response.body.codeFile,
          };
          break;
        case 'r':
          result = {
            name: response.body.name,
            description: response.body.desc,
            connections: response.body.connects.map(obj => Object({ start: obj.start.name, end: obj.end.name, mathRelation: obj.mathRelation })),
          };
          break;
        default:
      }
      return { body: result, statusCode: response.statusCode };
    }
    const result = Object('Couldn\'t find that in DB.'); // keep convention that always an object is returned.
    return { body: result, statusCode: response.statusCode };
  }
  const pathC = this.fullAddress_(`/gbn/c/${String(encodeURIComponent(uri))}`);
  const pathF = this.fullAddress_(`/gbn/f/${String(encodeURIComponent(uri))}`);
  const pathR = this.fullAddress_(`/gbn/r/${String(encodeURIComponent(uri))}`);
  let response = await request.get({
    uri: pathC,
    json: true,
    resolveWithFullResponse: true,
    simple: false,
  });
  if (response.statusCode === 200) {
    const result = {
      name: response.body.name,
      description: response.body.desc,
      units: response.body.units,
      asInput: response.body.func_arg.map(obj => Object({ name: obj.name, unit: obj.unitType })),
      asOutput: response.body.func_res.map(obj => Object({ name: obj.name, unit: obj.unitType })),
    };
    return { body: result, statusCode: response.statusCode };
  }
  response = await request.get({
    uri: pathF,
    json: true,
    resolveWithFullResponse: true,
    simple: false,
  });
  if (response.statusCode === 200) {
    const result = {
      name: response.body.name,
      description: response.body.desc,
      units: response.body.units,
      argsNames: response.body.argsNames,
      argsUnits: response.body.argsUnits,
      returnsNames: response.body.returnsNames,
      returnsUnits: response.body.returnsUnits,
      sourceCode: response.body.codeFile,
    };
    return { body: result, statusCode: response.statusCode };
  }
  response = await request.get({
    uri: pathR,
    json: true,
    resolveWithFullResponse: true,
    simple: false,
  });
  if (response.statusCode === 200) {
    const result = {
      name: response.body.name,
      description: response.body.desc,
      connections: response.body.connects.map(obj => Object({ start: obj.start.name, end: obj.end.name, mathRelation: obj.mathRelation })),
    };
    return { body: result, statusCode: response.statusCode };
  }
  const result = Object('Couldn\'t find that in DB.'); // keep convention that always an object is returned.
  return { body: result, statusCode: response.statusCode };
}

module.exports = lookup;
