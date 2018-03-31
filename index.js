class CallByMeaning {
	constructor(host) {
		this.host = 'https://call-by-meaning.herokuapp.com';
		if (host) this.host = String(host);
	}
	fullAddress_(path) {
		return this.host.concat(path);
	}
}

CallByMeaning.prototype.lookup = require('./src/lookup');
CallByMeaning.prototype.getURI = require('./src/getURI');
CallByMeaning.prototype.search = require('./src/search');
CallByMeaning.prototype.call = require('./src/call');
CallByMeaning.prototype.getCode = require('./src/getCode');
CallByMeaning.prototype.create = require('./src/create');
CallByMeaning.prototype.ask = require('./src/ask');

module.exports = CallByMeaning;
