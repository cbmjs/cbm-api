const request = require('sync-request');

function getCode(...args) {
  const nargs = args.length;

  if (nargs !== 1) {
    throw new Error('Insufficient input arguments. Must provide only a Javascript filename.');
  }

  const codeFile = args[0];
  if (!(typeof codeFile === 'string')) {
    throw new TypeError(`Invalid input argument. First argument must be a string primitive. Value: \`${codeFile}\`.`);
  }

  let path;
  if (codeFile.indexOf('/js') > -1 || codeFile.indexOf('/internal') > -1) {
    path = this.fullAddress_(codeFile.substring(1));
  } else {
    path = codeFile[0] === '_' ? this.fullAddress_(`/js/internal/${codeFile}`) : this.fullAddress_(`/js/${codeFile}`);
  }

  const res = request('get', path);
  return res.getBody('utf8');
}

module.exports = getCode;
