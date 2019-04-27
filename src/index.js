module.exports = (givenPath, options) => {

	return new Promise((resolve, reject) => {

		const fs = require('fs');
		const path = require('path');
		const url = require('url');

		let linkCollection = [];
		let filteredFiles = [];
		let matchedLinks = [];
		let parsedLinksCollection = [];
		let validatedLinksCollection = [];
		let brokenLinksCollection = [];
		let uniqueLinksCollection = [];


		const cwd = process.cwd();

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

		const filterFiles = (files) => {

			filteredFiles = files.filter(file => {

				if (path.extname(file) === '.md') {

					return file;

				}

			});

			return filteredFiles;

		};

		const getLinks = (file) => {

			const matchLinks = /\[([^[])+\]\(([^)])+\)/giu;

			matchedLinks = file.match(matchLinks);

			return matchedLinks;

		};

		const parseLinks = (matchedLinks) => {

			linkCollection = matchedLinks.map((link) => {

				const matchText = /\[([^[])+\]/giu;
				let linkText = link.match(matchText);

				const matchURL = /(http|https)+:{1}(\/){2}([\w\-:\.])+[\w\-\/=]*[^ \.]\b/giu;
				let linkURL = link.match(matchURL);

				linkString = linkURL.toString();

				parsedLinksCollection.push({linkText, linkURL, linkString});

				return parsedLinksCollection;

			});

		};

		const validateLink = (linkString) => {

			return new Promise((resolve, reject) => {

				let parsedURL = url.parse(linkString);

				const urlOptions = {

					method: 'HEAD',
					hostname: parsedURL.hostname,
					path: parsedURL.path,
					protocol: parsedURL.protocol

				};

				let linkProtocol = require('http');

				if (parsedURL.protocol === 'https:') {

					linkProtocol = require('https');

				}

				let request = linkProtocol.request(urlOptions);

				request.on('response', (response) => {

					let validatedLink = { linkText: link.linkText, linkURL: link.linkURL, statusCode: response.statusCode, statusMessage: response.statusMessage };

					resolve(validatedLinksCollection.push(validatedLink));

				})

				request.on('error', (error) => {

					reject({ error: error.code, linkString });

				});

				request.end();

			});

		};

		const validateAllLinks = (parsedLinksCollection) => {

			return new Promise((resolve, reject) => {

				let promises = [];

				parsedLinksCollection.forEach((link) => {

					promises.push(validateLink(link.linkString).catch(error => { return error }));

				});

				Promise.all(promises)

					.then((validatedLinksCollection) => {

						resolve(validatedLinksCollection);

					})

					.catch((error) => {

						console.log(error);

					});

			});

		};

		const getUniqueLinks = (givenLinkCollection) => {

			let retrieveLinks = givenLinkCollection.map((element) => {

				return (element.linkString);

			});

			uniqueLinksCollection = retrieveLinks.reduce((accumulatedValue, currentValue) => {

				if (accumulatedValue.indexOf(currentValue) === -1) {

					return accumulatedValue.concat(currentValue);

				} else {

					return accumulatedValue;

				}

			}, []);

			console.log(`\t${uniqueLinksCollection.length} unique link(s) found.\n`);

		};

		const getBrokenLinks = (givenLinkCollection) => {

			givenLinkCollection.forEach((element) => {

				let statusOk = [200, 301, 302];

				if (statusOk.indexOf(element.statusCode) === -1) {

					brokenLinksCollection.push(element);

				}

			});

		};

		const mdLinksNoOptions = (parsedLinksCollection) => {

			resolve(parsedLinksCollection);

		};

		const mdLinksStats = (givenLinkCollection) => {

			getUniqueLinks(givenLinkCollection);

			resolve(parsedLinksCollection, uniqueLinksCollection);

		};

		const mdLinksValidate = (givenLinkCollection) => {

			validateAllLinks(givenLinkCollection)

				.then((validatedLinksCollection) => {

					resolve({parsedLinksCollection, validatedLinksCollection});

				});

		};

		const mdLinksValidateStats = (parsedLinksCollection) => {

			validateAllLinks(parsedLinksCollection)

				.then((validatedLinksCollection) => {

					getUniqueLinks(validatedLinksCollection);

					getBrokenLinks(validatedLinksCollection);

					resolve({ parsedLinksCollection, validatedLinksCollection, uniqueLinksCollection, brokenLinksCollection });

				});

		};

		const printFilteredFiles = (filteredFiles) => {

			filteredFiles.forEach((file) => {

				console.log(`\t${file}\n`);

			});

		};

		const isDir = (givenPath) => {

			filteredFiles;

			readDirectory(givenPath)

				.then((files) => {

					filterFiles(files);

					if (filteredFiles.length < 1) {

						console.log('\n\tNo markdown (*.md) files were found.\n');

					} else {

						printFilteredFiles(filteredFiles);

					}

				})

				.catch((error) => {

					console.log(error);

				});

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

		const fileOrDir = (givenPath) => {

			if (path.extname(givenPath).length > 0) {

				if (path.extname(givenPath) === '.md') {

					isMdFile(givenPath);

				} else {

					console.log(`\n\tYou must provide a valid markdown (*.md) file.\n`);

				}

			} else if (path.extname(givenPath) === '') {

				isDir(givenPath);

			} else {

				console.log(`\n\tYou must provide a valid path to an (*.md) file or directory.\n`);

			}

		};

		const isMdFile = (givenPath) => {

			readFile(givenPath)

				.then((file) => {

					getLinks(file);

					if (matchedLinks === null) {

						return console.log('\tNo links were found in the (*.md) file.\n');

					} else {

						parseLinks(matchedLinks);

						validateOptions(options);

					}

				})

				.catch((error) => {

					console.log(error);

				});

		};

		const validatePath = (givenPath) => {

			if (givenPath === undefined) {

				console.log(`\n\tYou must provide a path to a markdown (*.md) file.\n`);

			}

			givenPath = path.resolve(cwd, givenPath);

			if (fs.existsSync(givenPath)) {

				console.log(`\n\tPath: ${givenPath}\n`);

				fileOrDir(givenPath);

			} else {

				console.log('\n\tThe provided path does not exist.\n');

			}

		};

		validatePath(givenPath);

	});

};