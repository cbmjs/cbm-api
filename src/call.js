const request = require('request-promise');
const JSON = require('../lib/jsonfn');

async function call(...args) {
  const nargs = args.length;
  let params;
  let returnCode = false;

  if (nargs < 1) {
    throw new Error('Insufficient input arguments. Must provide a params object.');
  }

  if (nargs < 7) {
    params = args[0];
    if (params.outputConcepts == null) {
      args.reverse();
      params = {};
      if (typeof args[0] === 'boolean') {
        returnCode = args[0];
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
    } else {
      returnCode = args[1];
    }
  } else {
    throw new Error('Too many input arguments. Must provide one params object or arguments that correspond to params properties.');
  }
  const response = await request.post({
    uri: this.fullAddress_('/cbm/call/'),
    headers: { returnCode },
    form: params,
    json: true,
    resolveWithFullResponse: true,
    simple: false,
  });
  if (returnCode) {
    const result = this.getCode(response.body.function);
    return { body: result, statusCode: response.statusCode };
  }
  let result = response.body;
  try {
    result = JSON.parse(response.body);
  } catch (e) { /**/ }
  return { body: result, statusCode: response.statusCode };
}

module.exports = call;
