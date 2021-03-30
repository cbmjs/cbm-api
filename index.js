class CallByMeaning {
	constructor(host) {
		this.host = "https://call-by-meaning.herokuapp.com";
		if (host) {
			this.host = String(host);
		}
	}

	fullAddress_(path) {
		return this.host + path;
	}
}

CallByMeaning.prototype.lookup = require("./src/lookup");
CallByMeaning.prototype.getURI = require("./src/get-uri");
CallByMeaning.prototype.search = require("./src/search");
CallByMeaning.prototype.call = require("./src/call");
CallByMeaning.prototype.getCode = require("./src/get-code");
CallByMeaning.prototype.create = require("./src/create");
CallByMeaning.prototype.ask = require("./src/ask");

module.exports = CallByMeaning;
