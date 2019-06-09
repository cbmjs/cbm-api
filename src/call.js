const got = require('got');
const JSON = require('../lib/jsonfn');

async function call(...args) {
  const nargs = args.length;
  let params;
  let returnCode = false;

  if (nargs < 1) {
    throw new Error('Insufficient input arguments. Must provide a params object.');
  }

  if (nargs > 6) {
    throw new Error('Too many input arguments. Must provide one params object or arguments that correspond to params properties.');
  }

  [params] = args;
  if (params.outputConcepts) {
    [, returnCode] = args;
  } else {
    args.reverse();
    params = {};
    if (typeof args[0] === 'boolean') {
      [returnCode] = args;
      params.outputUnits = args[1] || [];
      params.outputConcepts = args[2] || [];
      if (returnCode && nargs < 6) {
        params.inputUnits = args[3] || [];
        params.inputConcepts = args[4] || [];
      } else {
        params.inputVars = args[3] || [];
        params.inputUnits = args[4] || [];
        params.inputConcepts = args[5] || [];
      }
    } else {
      params.outputUnits = args[0] || [];
      params.outputConcepts = args[1] || [];
      params.inputVars = args[2] || [];
      params.inputUnits = args[3] || [];
      params.inputConcepts = args[4] || [];
    }
  }

  let response;
  try {
    response = await got.post(this.fullAddress_('/cbm/call/'), {
      body: params,
      json: true,
      headers: { returnCode, accept: null } });
  } catch (error) {
    ({ response } = error);
  }
  if (returnCode) {
    try {
      const result = await this.getCode(response.body.function);
      return { body: result, statusCode: response.statusCode };
    } catch (error) {
      return { body: error.response, statusCode: response.statusCode };
    }
  }
  let result = response.body;
  try {
    result = JSON.parse(response.body);
  } catch (error) { /**/ }
  return { body: result, statusCode: response.statusCode };
}

module.exports = call;
