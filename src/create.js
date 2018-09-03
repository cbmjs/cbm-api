const fs = require('fs');
const got = require('got');
const FormData = require('form-data');
const getURI = require('./get-uri');

async function createConcept(params, host) {
	const path = host.concat('/new/concept');
	if (!params.name) {
		return false;
	}
	try {
		const res = await got.post(path, {
			encoding: 'utf-8',
			body: {
				name: getURI(params.name),
				desc: params.desc,
				units: [].concat(params.units).map(el => getURI(el))
			},
			form: true
		});
		return res.statusCode === 200;
	} catch (error) {
		return false;
	}
}

async function createFunction(params, host) {
	const path = host.concat('/new/function');
	if (!params.name) {
		return false;
	}
	try {
		const res = await got.post(path, {
			encoding: 'utf-8',
			body: {
				name: params.name,
				desc: params.desc,
				argsNames: [].concat(params.argsNames).map(el => getURI(el)),
				argsUnits: [].concat(params.argsUnits).map(el => getURI(el)),
				returnsNames: [].concat(params.returnsNames).map(el => getURI(el)),
				returnsUnits: [].concat(params.returnsUnits).map(el => getURI(el))
			},
			form: true
		});
		return res.statusCode === 200;
	} catch (error) {
		return false;
	}
}

async function createAsyncFunction(params, callPath, host) {
	const path = host.concat('/new/function');
	if (!params.name) {
		return false;
	}
	const fullParams = {
		name: '',
		desc: '',
		argsNames: [],
		argsUnits: [],
		returnsNames: [],
		returnsUnits: [],
		codeFile: ''
	};
	Object.assign(fullParams, params);
	const form = new FormData();
	form.append('name', fullParams.name);
	form.append('desc', fullParams.desc);
	form.append('argsNames', `${[].concat(fullParams.argsNames).map(el => getURI(el))}`);
	form.append('argsUnits', `${[].concat(fullParams.argsUnits).map(el => getURI(el))}`);
	form.append('returnsNames', `${[].concat(fullParams.returnsNames).map(el => getURI(el))}`);
	form.append('returnsUnits', `${[].concat(fullParams.returnsUnits).map(el => getURI(el))}`);
	form.append('codeFile', fs.createReadStream(fullParams.codeFile));

	try {
		const res = await got.post(path, {
			body: form
		});
		await got.post(callPath, {
			body: {
				command: 'fixit'
			},
			form: true
		});
		return res.statusCode === 200;
	} catch (error) {
		return false;
	}
}

async function createRelation(params, host) {
	const path = host.concat('/new/relation');
	if (!params.name) {
		return false;
	}
	try {
		const res = await got.post(path, {
			encoding: 'utf-8',
			body: {
				name: params.name,
				desc: params.desc,
				start: getURI(params.start),
				end: getURI(params.end),
				mathRelation: params.mathRelation
			},
			form: true
		});
		return res.statusCode === 200;
	} catch (error) {
		return false;
	}
}

async function create(...args) {
	const nargs = args.length;
	let type;

	if (nargs < 1) {
		throw new Error('Insufficient input arguments. Must provide a params object.');
	}
	const [params] = args;
	if (typeof params !== 'object' || !params) {
		throw new TypeError('Invalid input argument. Argument must be an object.');
	}

	if (nargs < 2) {
		type = 'concept';
	} else {
		[, type] = args;
		if ((!(typeof type === 'string') || (['concept', 'function', 'relation'].indexOf(type) === -1))) {
			throw new TypeError(`Invalid input argument. type argument must be one of 'concept', 'function', 'relation'. Value: \`${type}\`.`);
		}
	}

	const path = this.host.concat('/new/fix');
	if (!(!params.codeFile || params.codeFile.length === 0)) {
		return createAsyncFunction(params, path, this.host);
	}
	let created = false;
	if (type === 'concept') {
		created = createConcept(params, this.host);
	}
	if (type === 'function') {
		created = createFunction(params, this.host);
	}
	if (type === 'relation') {
		created = createRelation(params, this.host);
	}
	try {
		await got.post(path, {
			body: {
				command: 'fixit'
			},
			form: true
		});
	} catch (error) { /**/ }
	return created;
}

module.exports = create;
