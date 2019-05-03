functions = require('../functions');

describe('validatePath', () => {

	it('should return an error if path is undefined', () => {

		validatePath(givenPath).then(result => {

			expect(result).toBe('\n\tYou must provide a path to a markdown (*.md) file.\n`');

		});

	});

});

/*
describe('filterMdFiles', () => {

	it('should be a function ', () => {

		console.log('true');

	});

});

describe('getFile', () => {

	it('should be a function ', () => {

		console.log('file');

	});

});

describe('getLinks', () => {

	it('should be a function ', () => {

		console.log('linkCollection');

	});

});

describe('validateLinks', () => {

	it('should be a function ', () => {

		console.log('validatedLinks');

	});

});

*/
