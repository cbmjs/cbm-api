# cbm-api

> Node.js interface to the cbmjs network server. For further information, consult the website of the server-side project: [cbm-engine](https://github.com/cbmjs/cbm-engine).

[![build](https://img.shields.io/github/workflow/status/cbmjs/cbm-api/Build%20%26%20Test?style=for-the-badge&logo=github&label=)](https://github.com/cbmjs/cbm-api/actions) [![codecov](https://img.shields.io/codecov/c/github/cbmjs/cbm-api.svg?style=for-the-badge)](https://codecov.io/gh/cbmjs/cbm-api) [![npm](https://img.shields.io/npm/v/@cbmjs/cbm-api.svg?style=for-the-badge)](https://www.npmjs.com/package/cbmjs/cbm-api) [![license](https://img.shields.io/github/license/cbmjs/cbm-api.svg?style=for-the-badge)](https://github.com/cbmjs/cbm-api/blob/master/LICENSE)

## Introduction

To require the module in a project, we can use the expression:

```javascript
const CallByMeaning = require("@cbmjs/cbm-api");
```

## Getting Started

The module exports a single constructor which can be used to open an API connection. Simply call it and store the expression result in a variable:

```javascript
const cbm = new CallByMeaning();
```

In case that you are running your own copy of the cbmjs server, the constructor takes the hostname of the server as an optional argument. The default option evaluates to "[https://call-by-meaning.herokuapp.com](https://call-by-meaning.herokuapp.com/)".

```javascript
CallByMeaning(host);
```

Example:

```javascript
const cbm = new CallByMeaning("http://localhost:3000");
```

We can then use the following six methods to query the cbmjs API:

## Methods

### `.lookup(uri[, type])`

This method expects a valid cbmjs URI as its first argument.
`type` is an (optional) string that specifies the type of the GET request. It can have the keys `c`, `f` or `r`. This method is asynchronous and returns a promise that, when fulfilled, returns an object with two properties.`statusCode` which contains the status code of the request and `body` that holds the result set from the query.

Example code:

```javascript
cbm
	.lookup("time", "c")
	.then(result => {
		if (result.statusCode === 200) console.log("Success!");
		// insert code here
	})
	.catch(error => console.error(error));
```

### `.getURI(text)`

This method finds out what the cbmjs URI is for a given text, applying steps such as reducing English words to their root form and removing special characters.

Example code:

```javascript
cbm.getURI("a (big) dog!"); //-> big_dog
```

### `.search(...args)`

This method finds all the functions that correspond to given concepts and returns an array containing them. It can be called with two different ways. Either by providing only an object containing the search parameters or by providing the parameters themselves as arguments. This method is asynchronous and returns a promise that, when fulfilled, returns an object with two properties.`statusCode` which contains the status code of the request and `body` that holds the result set from the query. For a full overview of search parameters, check the [documentation](https://github.com/cbmjs/cbm-engine/blob/master/docs/GETBYMEANING.md).

Example code:

```javascript
cbm
	.search({ inputConcepts: "date", outputConcepts: "time" })
	.then(result => {
		if (result.statusCode === 200) console.log("Success!");
		// insert code here
	})
	.catch(error => console.error(error));

cbm
	.search("date", "time")
	.then(result => {
		if (result.statusCode === 200) console.log("Success!");
		// insert code here
	})
	.catch(error => console.error(error));
```

### `.call(...args)`

This method takes the search parameters and after finding an appropriate function - a function with the same concepts as inputs and outputs, but (maybe) in different units, that is - executes it and returns the result. If the (optional) argument `returnCode` is set to true, it instead returns the .js file's name and the description of the function. It can be called with two different ways. Either by providing only an object containing the search parameters (and maybe the optional returnCode as a second argument) or by providing the parameters themselves as arguments. This method is asynchronous and returns a promise that, when fulfilled, returns an object with two properties.`statusCode` which contains the status code of the request and `body` that holds the result set from the query. For a full overview of search parameters, check the [documentation](https://github.com/cbmjs/cbm-engine/blob/master/docs/CALLBYMEANING.md).

Example code:

```javascript
const bday = new Date(1994, 2, 24);

cbm.call({
  'inputConcepts': 'date',
  // 'date' doesn't have a unit, so we can omit it, or pass {'inputUnits': null} or {'inputUnits': []} or {'inputUnits: '-'} or {'inputUnits': 'date'}
  'inputVars': bday,
  'outputConcepts': 'time',
  'outputUnits': 'seconds'
}).then((result) => {
  if (result.statusCode === 200) console.log('Success!');
  // insert code here
}).catch((error) => console.error(error));

cbm.call('date', null, 'time', 'seconds').then(...);
cbm.call('date', null, 'time', 'seconds', true).then(...); // If we want the source code
```

### `.getCode(fileName)`

This method acts as a small helper to the usage of `.search` and `.call` methods. It takes the `name` of a .js file in the server and returns its code in plain text.This method is asynchronous and returns a promise that, when fulfilled, returns a string containing the code.

Example code:

```javascript
cbm.getCode("getTime.js").then(code => {
	const getTime = eval(code);
	getTime();
});
```

## `.create(params[, type])`

This method creates a document in the server if it doesn't exist or modifies it, if it does. It accepts a [params](https://github.com/cbmjs/cbm-engine/blob/master/docs/MODELS.md) object with the document parameters as its first argument and a string containing the type of the document. It can be one of `concept`, `function`, `relation`. If it isn't provided, it defaults to `concept`. This method is asynchronous and returns a promise that, when fulfilled, returns a boolean, depending of its success.

Example code:

```javascript
let params = {
	name: "aConcept",
	desc: "aDescription"
};
cbm.create(params);
```

```javascript
let params = {
	name: "aFunction",
	desc: "aDescription",
	argsNames: "someArg",
	argsUnits: "someUnit",
	returnsNames: "someReturn",
	returnsUnits: "someUnit"
};
cbm.create(params, "function");

params.codeFile = __dirname.concat("/someFile.js");
(async () => {
	let res = await cbm.create(params, "function");
	return res;
})().then(res => console.log(res));
```

```javascript
let params = {
	name: "unitConversion",
	start: "meters",
	end: "feet",
	mathRelation: "0.3 * start"
};
cbm.create(params, "relation");
```

## Unit Tests

Run tests via the command `yarn test`

## License

AGPL-3.0 © [Napoleon-Christos Oikonomou](https://iamnapo.me)
