import natural from "natural";

const tokenizer = new natural.WordTokenizer();

export default function getURI(...args) {
	const nargs = args.length;
	let text;
	if (!args[0]) {
		return args[0];
	}

	if (nargs !== 1) {
		throw new Error("Invalid input arguments. Must provide only an input text.");
	}

	[text] = args;
	if (!(typeof text === "string")) {
		throw new TypeError(`Invalid input argument. Argument must be a string primitive. Value: \`${text}\`.`);
	}

	text = text.replaceAll(/[^\s\w]/g, "");
	let stemmed = tokenizer.tokenize(text);
	stemmed = stemmed.filter((item) => (item !== "a") && (item !== "the") && (item !== "an"));
	return stemmed.join("_");
}
