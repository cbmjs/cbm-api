import lookup from "./src/lookup.js";
import getURI from "./src/get-uri.js";
import search from "./src/search.js";
import call from "./src/call.js";
import getCode from "./src/get-code.js";
import create from "./src/create.js";
import ask from "./src/ask.js";

export default class CallByMeaning {
	constructor(host) {
		this.host = "https://call-by-meaning.herokuapp.com";
		if (host) this.host = String(host);
		this.lookup = lookup;
		this.getURI = getURI;
		this.search = search;
		this.call = call;
		this.getCode = getCode;
		this.create = create;
		this.ask = ask;
	}

	fullAddress_(path) {
		return this.host + path;
	}
}

