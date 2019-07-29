module.exports = {

	directoryFileList: [],
	linksCollection: [
	],
	parsedLinksCollection: [],
	validatedLinksCollection: [],
	brokenLinksCollection: [],
	uniqueLinksCollection: []

};

const getBrokenLinks = (validatedLinksCollection) => {

	let validStatusCodes = [200, 301, 302];

	validatedLinksCollection.forEach((element) => {

		if (validStatusCodes.indexOf(element.statusCode) === -1) {

			brokenLinksCollection.push(element);

		}

		return brokenLinksCollection;

	});

};

const parseLinks = (linksCollection) => {

	let linkText = [];
	let linkUrlString = [];

	linksCollection.forEach((element) => {

		let lineNumber = element.lineNumber;

		const matchText = /\[([^[])+\]/giu;
		linkText = element.matchedLink[0].match(matchText).toString();

		if ((/http/gi).test(element.matchedLink)) {

			const matchURL = /(http|https)+:{1}(\/){2}([\w\-:\.])+[\w\-\/=]*[^ \.]\b/giu;
			linkUrlString = element.matchedLink[0].match(matchURL).toString();

			parsedLinksCollection.push({linkText, linkUrlString, lineNumber });

		}

	});

	return parsedLinksCollection;

};

module.exports = getBrokenLinks;
module.exports = parseLinks;
