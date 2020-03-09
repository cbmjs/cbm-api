require("dotenv").config();
const test = require("ava");

const CallByMeaning = require("..");

const HOST = process.env.HOST || "https://call-by-meaning.herokuapp.com";

test("creates an instance of cbm-api", (t) => {
	const cbm = new CallByMeaning(HOST);
	t.true(cbm instanceof CallByMeaning);
});

test("can’t be invoked without new", (t) => {
	t.throws(() => CallByMeaning(HOST));
});

test("has default hostname", (t) => {
	const cbm = new CallByMeaning();
	t.is(cbm.host, "https://call-by-meaning.herokuapp.com");
});

test("has set hostname", (t) => {
	const cbm = new CallByMeaning("10.0.0.1");
	t.is(cbm.host, "10.0.0.1");
});
