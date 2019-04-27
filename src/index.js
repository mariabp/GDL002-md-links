module.exports = (givenPath, options) => {

	'use strict';

	return new Promise((resolve, reject) => {

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

			});

		};

		const getLinks = (mdfile) => {

			const matchLinks = /\[([^[])+\]\(([^)])+\)/giu;

			linksCollection = mdfile.match(matchLinks);

		};

		const parseLinks = (linksCollection) => {

			linksCollection.forEach((element) => {

				const matchText = /\[([^[])+\]/giu;
				let linkText = element.match(matchText);

				const matchURL = /(http|https)+:{1}(\/){2}([\w\-:\.])+[\w\-\/=]*[^ \.]\b/giu;
				let linkUrlString = element.match(matchURL).toString();

				parsedLinksCollection.push({ linkText, linkUrlString });

			});

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
							statusMessage: response.statusMessage

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

			});

		};

		const resolvePromise = (givenCollections) => {

			resolve(givenCollections);

		};

		const mdLinksNoOptions = (parsedLinksCollection) => {

			resolvePromise({ parsedLinksCollection });

		};

		const mdLinksValidate = (parsedLinksCollection) => {

			validateAllLinks(parsedLinksCollection)

				.then((validatedLinksCollection) => {

					resolvePromise({ parsedLinksCollection, validatedLinksCollection });

				})

				.catch((error) => {

					return console.log(error);

				})

			;

		};

		const mdLinksStats = (givenLinkCollection) => {

			getUniqueLinks(givenLinkCollection);

			resolvePromise({ parsedLinksCollection, uniqueLinksCollection });

		};

		const mdLinksValidateStats = (parsedLinksCollection) => {

			getUniqueLinks(parsedLinksCollection);

			validateAllLinks(parsedLinksCollection)

				.then((validatedLinksCollection) => {

					getBrokenLinks(validatedLinksCollection);

					resolvePromise({ parsedLinksCollection, uniqueLinksCollection, validatedLinksCollection, brokenLinksCollection });

				})

				.catch((error) => {

					return console.log(error);

				})

			;

		};

		const validateOptions = (options) => {

			if (options[0] === '--validate' && options[1] === undefined) {

				mdLinksValidate(parsedLinksCollection);

			} else if (options[0] === '--stats') {

				mdLinksStats(parsedLinksCollection);

			} else if (options[0] === '--validate' && options[1] === '--stats') {

				mdLinksValidateStats(validatedLinksCollection);

			} else {

				mdLinksNoOptions(parsedLinksCollection);

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

					;

					filterDirectoryMarkdownFiles(files);

					if (directoryFileList.length === 0) {

						console.log(`\tERROR! There are no markdown (*.md) files on the provided directory.\n`);

					} else {

						directoryFileList.forEach((element) => {

							console.log(`\t${element}`);

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