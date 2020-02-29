const got = require("got");

async function getCode(...args) {
	const nargs = args.length;

	if (nargs !== 1) {
		throw new Error("Insufficient input arguments. Must provide only a Javascript filename.");
	}

	const [codeFile] = args;
	if (!(typeof codeFile === "string")) {
		throw new TypeError(`Invalid input argument. First argument must be a string primitive. Value: \`${codeFile}\`.`);
	}

	let path;
	if (codeFile.includes("/js") || codeFile.includes("/internal")) {
		path = this.fullAddress_(codeFile.slice(1));
	} else {
		path = codeFile[0] === "_" ? this.fullAddress_(`/js/internal/${codeFile}`) : this.fullAddress_(`/js/${codeFile}`);
	}

	const res = await got(path);
	return res.body;
}

module.exports = getCode;
