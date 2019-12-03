const got = require("got");

async function search(...args) {
	const nargs = args.length;
	let params;

	if (nargs < 1) {
		throw new Error("Insufficient input arguments. Must provide a params object.");
	}

	if (nargs < 3) {
		[params] = args;
		if (!params.outputConcepts) {
			params = {};
			args.reverse();
			params = {
				inputConcepts: args[1] || [],
				outputConcepts: args[0] || [],
			};
		}
	} else {
		throw new Error("Too many input arguments. Must provide one params object or two arrays/strings(input, output) or one array/string(output).");
	}
	let response;
	try {
		response = await got.post(this.fullAddress_("/gbm/search/"), { json: params, responseType: "json", headers: { accept: undefined } });
	} catch (error) {
		({ response } = error);
	}
	try {
		const result = response.body.map((obj) => ({ function: obj.function.split("/").pop(), description: obj.desc }));
		return { body: result, statusCode: response.statusCode };
	} catch (error) {
		return { body: response.body, statusCode: response.statusCode };
	}
}

module.exports = search;
