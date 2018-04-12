const got = require('got');

async function getCode(...args) {
	const nargs = args.length;

	if (nargs !== 1) {
		throw new Error('Insufficient input arguments. Must provide only a Javascript filename.');
	}

	const [codeFile] = args;
	if (!(typeof codeFile === 'string')) {
		throw new TypeError(`Invalid input argument. First argument must be a string primitive. Value: \`${codeFile}\`.`);
	}

	let path;
	if (codeFile.indexOf('/js') > -1 || codeFile.indexOf('/internal') > -1) {
		path = this.fullAddress_(codeFile.substring(1));
	} else {
		path = codeFile[0] === '_' ? this.fullAddress_(`/js/internal/${codeFile}`) : this.fullAddress_(`/js/${codeFile}`);
	}

	const res = await got(path, {encoding: 'utf-8'});
	return res.body;
}

module.exports = getCode;
