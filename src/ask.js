const LUIS = require('../lib/luis');

const luis = LUIS({
  appId: '98dad933-f92f-4d45-aabc-9f00caa9ffb3',
  appKey: 'd21ef49d7fd5482a80cfc8f2ee335176',
  verbose: true,
});

async function ask(...args) {
  const nargs = args.length;
  const params = {};
  params.inputNodes = [];
  params.outputNodes = [];

  if (nargs !== 1) {
    throw new Error('Insufficient input arguments. Must provide a natural language query.');
  }
  if (args[0] == null) return args[0];

  const query = args[0];
  if (!(typeof query === 'string')) {
    throw new TypeError(`Invalid input argument. Argument must be a string primitive. Value: \`${query}\`.`);
  }

  const response = await luis.predict(query);
  for (const entity of response.entities) {
    if (entity.type === 'inputNodes') params.inputNodes.push(entity.entity);
    if (entity.type === 'outputNodes') params.outputNodes.push(entity.entity);
  }
  return this.search(params);
}

module.exports = ask;
