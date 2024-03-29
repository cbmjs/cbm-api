import luiS from "../lib/luis.js";

const luis = luiS({
	appId: "98dad933-f92f-4d45-aabc-9f00caa9ffb3",
	appKey: process.env.LUIS_KEY || "eb958580c4704aca9e3739d7753f5458",
	verbose: true,
});

export default async function ask(...args) {
	const nargs = args.length;
	const params = {};
	params.inputConcepts = [];
	params.outputConcepts = [];

	if (nargs !== 1) {
		throw new Error("Insufficient input arguments. Must provide a natural language query.");
	}

	if (!args[0]) {
		return args[0];
	}

	const [query] = args;
	if (!(typeof query === "string")) {
		throw new TypeError(`Invalid input argument. Argument must be a string primitive. Value: \`${query}\`.`);
	}

	const response = await luis.predict(query);
	for (const entity of response.body.entities) {
		if (entity.type === "inputConcepts") {
			params.inputConcepts.push(entity.entity);
		}

		if (entity.type === "outputConcepts") {
			params.outputConcepts.push(entity.entity);
		}
	}

	return this.search(params);
}
