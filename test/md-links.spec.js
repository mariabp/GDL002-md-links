getBrokenLinks = require('./for-testing');
parseLinks = require('./for-testing');
linksCollection = require('./for-testing');

describe('getBrokenLinks', () => {

	it('should be a function ', () => {

		expect(typeof (getBrokenLinks)).toBe('function');

	});

});

describe('parseLinks', () => {

	it('should be a function ', () => {

		expect(typeof (parseLinks)).toBe('function');

	});

	it('should return an array of parsed links ', () => {

		expect(parseLinks(linksCollection)).toBe('[]');

	});

});