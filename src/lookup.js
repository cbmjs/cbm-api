const got = require("got");

async function lookup(...args) {
	const nargs = args.length;
	let type;

	if (nargs < 1) {
		throw new Error("Insufficient input arguments. Must provide a cbmjs URI.");
	}

	const [uri] = args;
	if (!(typeof uri === "string")) {
		throw new TypeError(`Invalid input argument. First argument must be a string primitive. Value: \`${uri}\`.`);
	}

	if (nargs < 2) {
		type = "all";
	} else {
		[, type] = args;
		if ((!(typeof uri === "string") || (!["c", "f", "r"].includes(type)))) {
			throw new TypeError(`Invalid input argument. type argument must be one of \`c\`, \`f\`, \`r\`. Value: \`${type}\`.`);
		}
	}

	if (type !== "all") {
		const path = `/gbn/${type}/${String(encodeURIComponent(uri))}`;
		const result = {};
		try {
			const response = await got(this.fullAddress_(path), { responseType: "json" });
			switch (type) {
			case "c":
				result.body = {
					name: response.body.name,
					description: response.body.desc,
					units: response.body.units,
					asInput: response.body.func_arg.map((obj) => ({ name: obj.name, unit: obj.unitType })),
					asOutput: response.body.func_res.map((obj) => ({ name: obj.name, unit: obj.unitType })),
				};
				result.statusCode = response.statusCode;
				break;
			case "f":
				result.body = {
					name: response.body.name,
					description: response.body.desc,
					units: response.body.units,
					argsNames: response.body.argsNames,
					argsUnits: response.body.argsUnits,
					returnsNames: response.body.returnsNames,
					returnsUnits: response.body.returnsUnits,
					sourceCode: response.body.codeFile,
				};
				result.statusCode = response.statusCode;
				break;
			case "r":
				result.body = {
					name: response.body.name,
					description: response.body.desc,
					connections: response.body.connects.map((obj) => ({ start: obj.start.name, end: obj.end.name, mathRelation: obj.mathRelation })),
				};
				result.statusCode = response.statusCode;
				break;
			default:
			}
		} catch (error) {
			result.body = { String: "Couldn’t find that in DB." }; // Keep convention that always an object is returned.
			result.statusCode = error.response.statusCode;
		}
		return result;
	}
	const pathC = this.fullAddress_(`/gbn/c/${String(encodeURIComponent(uri))}`);
	const pathF = this.fullAddress_(`/gbn/f/${String(encodeURIComponent(uri))}`);
	const pathR = this.fullAddress_(`/gbn/r/${String(encodeURIComponent(uri))}`);
	try {
		const response = await got(pathC, { responseType: "json" });
		const result = {
			name: response.body.name,
			description: response.body.desc,
			units: response.body.units,
			asInput: response.body.func_arg.map((obj) => ({ name: obj.name, unit: obj.unitType })),
			asOutput: response.body.func_res.map((obj) => ({ name: obj.name, unit: obj.unitType })),
		};
		return { body: result, statusCode: response.statusCode };
	} catch { /**/ }
	try {
		const response = await got(pathF, { responseType: "json" });
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
	} catch { /**/ }
	try {
		const response = await got(pathR, { responseType: "json" });
		const result = {
			name: response.body.name,
			description: response.body.desc,
			connections: response.body.connects.map((obj) => ({ start: obj.start.name, end: obj.end.name, mathRelation: obj.mathRelation })),
		};
		return { body: result, statusCode: response.statusCode };
	} catch (error) {
		return { body: { String: "Couldn’t find that in DB." }, statusCode: error.response.statusCode };
	}
}

module.exports = lookup;
