module.exports = (givenPath, options) => {

	'use strict';

	return new Promise((resolve) => {

		const fs = require('fs');
		const path = require('path');
		const url = require('url');

		const cwd = process.cwd();

		let directoryFileList = [];
		let linksCollection = [];
		let parsedLinksCollection = [];
		let validatedLinksCollection = [];
		let brokenLinksCollection = [];
		let uniqueLinksCollection = [];

		const readDirectory = (givenPath) => {

			return new Promise((resolve, reject) => {

				fs.readdir(givenPath, 'utf8', (err, files) => {

					return err ? reject(err) : resolve(files);

				});

			});

		};

		const readFile = (givenPath) => {

			return new Promise((resolve, reject) => {

				fs.readFile(givenPath, 'utf8', (err, file) => {

					return err ? reject(err) : resolve(file);

				});

			});

		};

		const filterDirectoryMarkdownFiles = (files) => {

			files.forEach((element) => {

				if (path.extname(element) === '.md') {

					directoryFileList.push(element);

				}

				return directoryFileList;

			});

		};

		const getLinks = (mdfile) => {

			mdfile = mdfile.split('\n');

			mdfile.forEach(element => {

				const matchLink = /\[([^\[\]])+\]\(([^\(\)])+\)/gi;
				let matchedLink = element.match(matchLink);


				if (matchedLink !== null) {

					let lineNumber = mdfile.indexOf(element) + 1;

					linksCollection.push({matchedLink, lineNumber});

				}

			});

			return linksCollection;

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

		const validateLink = (givenLink) => {

			return new Promise((resolve, reject) => {

				let parsedURL = url.parse(givenLink.linkUrlString);

				const options = {

					method: 'HEAD',
					hostname: parsedURL.hostname,
					path: parsedURL.path,
					protocol: parsedURL.protocol

				};

				let linkProtocol = require('http');

				if (parsedURL.protocol === "https:") {

					linkProtocol = require('https');

				}

				linkProtocol.request(options)

					.on('response', (response) => {

						let validatedLink = {

							linkText: givenLink.linkText,
							linkUrlString: givenLink.linkUrlString,
							statusCode: response.statusCode,
							statusMessage: response.statusMessage,
							lineNumber: givenLink.lineNumber

						};

						validatedLinksCollection.push(validatedLink);

						resolve(validatedLink);

					})

					.on('error', (error) => {

						reject({ error: error.code, givenLink });

					})

					.end()

				;

			});

		};

		const validateAllLinks = (parsedLinksCollection) => {

			return new Promise((resolve, reject) => {

				let validatePromises = [];

				parsedLinksCollection.forEach((element) => {

					validatePromises.push(validateLink(element).catch((error) => {

						return error;

					}));

				});

				Promise.all(validatePromises)

					.then((validatedLinksCollection) => {

						resolve(validatedLinksCollection);

					})

				;

			});

		};

		const getUniqueLinks = (parsedLinksCollection) => {

			let retrieveLinks = parsedLinksCollection.map((element) => {

				return (element.linkUrlString);

			});

			uniqueLinksCollection = retrieveLinks.reduce((accumulatedValue, currentValue) => {

				if (accumulatedValue.indexOf(currentValue) === -1) {

					return accumulatedValue.concat(currentValue);

				} else {

					return accumulatedValue;

				}

			}, []);

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

		const mdLinksNoOptions = (parsedLinksCollection) => {

			resolve({ isNoOptions: true, parsedLinksCollection });

		};

		const mdLinksValidate = (parsedLinksCollection) => {

			validateAllLinks(parsedLinksCollection)

				.then((validatedLinksCollection) => {

					resolve({ isValidate: true, parsedLinksCollection, validatedLinksCollection });

				})

				.catch((error) => {

					return console.log(error);

				})

			;

		};

		const mdLinksStats = (givenLinkCollection) => {

			getUniqueLinks(givenLinkCollection);

			resolve({ isStats: true, parsedLinksCollection, uniqueLinksCollection });

		};

		const mdLinksValidateStats = (parsedLinksCollection) => {

			getUniqueLinks(parsedLinksCollection);

			validateAllLinks(parsedLinksCollection)

				.then((validatedLinksCollection) => {

					getBrokenLinks(validatedLinksCollection);

					resolve({ isValidateStats: true, parsedLinksCollection, uniqueLinksCollection, validatedLinksCollection, brokenLinksCollection });

				})

				.catch((error) => {

					return console.log(error);

				})

			;

		};

		const validateOptions = (options) => {

			if (options === undefined) {

				mdLinksNoOptions(parsedLinksCollection);

			} else {

				if (options[0] === "--validate" && options[1] === undefined) {

					mdLinksValidate(parsedLinksCollection);

				} else if (options[0] === "--stats") {

					mdLinksStats(parsedLinksCollection);

				} else if (options[0] === "--validate" && options[1] === "--stats") {

					mdLinksValidateStats(parsedLinksCollection);

				} else if (options.validate === true && options.stats === false) {

					mdLinksValidate(parsedLinksCollection);

				} else if (options.validate === false && options.stats === true) {

					mdLinksStats(parsedLinksCollection);

				} else if (options.validate === true && options.stats === true) {

					mdLinksValidateStats(parsedLinksCollection);

				} else {

					mdLinksNoOptions(parsedLinksCollection);

				}

			}

		};

		const readMarkdownFile = (givenPath, options) => {

			readFile(givenPath)

				.then((mdfile) => {

					getLinks(mdfile);

					if (linksCollection === null) {

						return console.log(`\n\t\tNo links found in the provided markdown (*.md) file.\n`);

					} else {

						parseLinks(linksCollection);

						validateOptions(options);

					}

				})

				.catch((error) => {

					return console.log(error);

				});

		};

		const getDirectoryFiles = (givenPath) => {

			readDirectory(givenPath)

				.then((files) => {


					filterDirectoryMarkdownFiles(files);

					if (directoryFileList.length === 0) {

						console.log(`\n\tERROR! There are no markdown (*.md) files on the provided directory.\n`);

					} else {

						directoryFileList.forEach((element) => {

							console.log(`\n\t${element}`);

						});

						console.log(`\n\t${directoryFileList.length} markdown (*.md) file(s) found in total.\n`);

					}

				});

		};

		const validatePath = (givenPath) => {

			if (givenPath === undefined) {

				return console.log(`\n\tERROR! You must provide the path to a markdown (*.md) file.\n\n\tValid Syntax:\n\n\t\t> md-links path\\to\\md\\file.md\n\n\t\t> md-links path\\to\\md\\file.md --validate\n\n\t\t> md-links path\\to\\md\\file.md --stats\n\n\t\t> md-links path\\to\\md\\file.md --validate --stats\n\n\tFor help, type md-links --help\n`);

			}

			givenPath = path.resolve(cwd, givenPath);

			if (fs.existsSync(givenPath)) {

				if (path.extname(givenPath) === ".md") {

					readMarkdownFile(givenPath, options);

				} else if (path.extname(givenPath) === "") {

					getDirectoryFiles(givenPath);

				} else {

					console.log(`\n\tERROR! Only markdown (*.md) files can be used with mdlinks.\n`);

				}

			} else {

				console.log(`\n\tERROR! You must provide a valid path to a markdown (*.md) file or directory.\n`);

			}

		};

		validatePath(givenPath);

	});

};