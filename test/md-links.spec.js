const mdLinks = require('../src/index');
const fs = require('../src/index');
const path = require('../src/index');
const validatePath = require('../src/index');

describe('validatePath', () => {

	it('should return an error if path is undefined', () => {

		validatePath('').then(result => {

			expect(result).toBe('You must provide a path to a markdown (*.md) file.');

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
