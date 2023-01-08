import fs from "node:fs";

import got from "got";
import { FormData } from "formdata-node";

import getURI from "./get-uri.js";

async function createConcept(params, host) {
	const path = `${host}/new/concept`;
	if (!params.name) {
		return false;
	}

	try {
		const res = await got.post(path, {
			form: {
				name: getURI(params.name),
				desc: params.desc,
				units: [params.units].flat().map((el) => getURI(el)),
			},
		});
		return res.statusCode === 200;
	} catch {
		return false;
	}
}

async function createFunction(params, host) {
	const path = `${host}/new/function`;
	if (!params.name) {
		return false;
	}

	try {
		const res = await got.post(path, {
			form: {
				name: params.name,
				desc: params.desc,
				argsNames: [params.argsNames].flat().map((el) => getURI(el)),
				argsUnits: [params.argsUnits].flat().map((el) => getURI(el)),
				returnsNames: [params.returnsNames].flat().map((el) => getURI(el)),
				returnsUnits: [params.returnsUnits].flat().map((el) => getURI(el)),
			},
		});
		return res.statusCode === 200;
	} catch {
		return false;
	}
}

async function createAsyncFunction(params, callPath, host) {
	const path = `${host}/new/function`;
	if (!params.name) {
		return false;
	}

	const fullParams = {
		name: "",
		desc: "",
		argsNames: [],
		argsUnits: [],
		returnsNames: [],
		returnsUnits: [],
		codeFile: "",
	};
	Object.assign(fullParams, params);
	const form = new FormData();
	form.append("name", fullParams.name);
	form.append("desc", fullParams.desc);
	form.append("argsNames", `${[fullParams.argsNames].flat().map((el) => getURI(el))}`);
	form.append("argsUnits", `${[fullParams.argsUnits].flat().map((el) => getURI(el))}`);
	form.append("returnsNames", `${[fullParams.returnsNames].flat().map((el) => getURI(el))}`);
	form.append("returnsUnits", `${[fullParams.returnsUnits].flat().map((el) => getURI(el))}`);
	form.append("codeFile", fs.createReadStream(fullParams.codeFile));

	try {
		const res = await got.post(path, { body: form });
		await got.post(callPath, { form: { command: "fixit" } });
		return res.statusCode === 200;
	} catch {
		return false;
	}
}

async function createRelation(params, host) {
	const path = `${host}/new/relation`;
	if (!params.name) {
		return false;
	}

	try {
		const res = await got.post(path, {
			form: {
				name: params.name,
				desc: params.desc,
				start: getURI(params.start),
				end: getURI(params.end),
				mathRelation: params.mathRelation,
			},
		});
		return res.statusCode === 200;
	} catch {
		return false;
	}
}

export default async function create(...args) {
	const nargs = args.length;
	let type;

	if (nargs < 1) {
		throw new Error("Insufficient input arguments. Must provide a params object.");
	}

	const [params] = args;
	if (typeof params !== "object" || !params) {
		throw new TypeError("Invalid input argument. Argument must be an object.");
	}

	if (nargs < 2) {
		type = "concept";
	} else {
		[, type] = args;
		if ((!(typeof type === "string") || (!["concept", "function", "relation"].includes(type)))) {
			throw new TypeError(`Invalid input argument. type argument must be one of \`concept\`, \`function\`, \`relation\`. Value: \`${type}\`.`);
		}
	}

	const path = `${this.host}/new/fix`;
	if (!(!params.codeFile || params.codeFile.length === 0)) {
		return createAsyncFunction(params, path, this.host);
	}

	let created = false;
	if (type === "concept") {
		created = createConcept(params, this.host);
	}

	if (type === "function") {
		created = createFunction(params, this.host);
	}

	if (type === "relation") {
		created = createRelation(params, this.host);
	}

	try {
		await got.post(path, { form: { command: "fixit" } });
	} catch { /**/ }

	return created;
}
