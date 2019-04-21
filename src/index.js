module.exports = (givenPath, options) => {

	const fs = require('fs');
	const path = require('path');
	const url = require('url');

	let linkCollection = [];
	let filteredFiles = [];
	let matchedLinks = [];
	let parsedLinksCollection = [];

	const cwd = process.cwd();

	const readDir = (absolutePath) => {

		return new Promise((resolve, reject) => {

			fs.readdir(absolutePath, 'utf8', (err, files) => {

				return err ? reject(err) : resolve(files);

			});

		});

	};

	const readFile = (absolutePath) => {

		return new Promise((resolve, reject) => {

			fs.readFile(absolutePath, 'utf8', (err, file) => {

				return err ? reject(err) : resolve(file);

			});

		});

	};

	const filterFiles = (files) => {

		filteredFiles = files.filter(file => {

			if (path.extname(file) === ".md") {

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

		console.log(`\t${linkCollection.length} links were found in total.\n`);

	};

	const printLinks = (parsedLinksCollection) => {

		getLinks(file);
		parseLinks(matchedLinks);

		parsedLinksCollection.forEach((link) => {

			console.log(`\t${link.linkText} ${link.linkURL}\n`);

		});

	};

	const validateAllLinks = (parsedLinksCollection) => {

		parsedLinksCollection.forEach((link) => {

			validateLink(link.linkString)

				.then((response) => {

					console.log(`\t${link.linkText} ${link.linkURL} ( ${response.statusCode} ${response.statusMessage} )\n`);

				})

				.catch((error) => {

					console.log(error);

				});

		});


	};

	const validateLink = (linkString) => {

		return new Promise((reject, resolve) => {

			let parsedURL = url.parse(linkString);

			const urlOptions = {

				method: 'HEAD',
				hostname: parsedURL.hostname,
				path: parsedURL.path,
				protocol: parsedURL.protocol

			};

			let linkProtocol = require('http');

			if (parsedURL.protocol === "https:") {

				linkProtocol = require('https');

			}

			let request = linkProtocol.request(urlOptions, (err, response) => {

				return err ? reject(err) : resolve(response);

			});

			request.on('error', (error) => {

				console.log(`\t${error.code}\n`);

			});

			request.end();

		});

	};

	const printFilteredFiles = (filteredFiles) => {

		filteredFiles.forEach((file) => {

			console.log(`\t${file}\n`);

		});

	};

	const isDir = (absolutePath) => {

		filteredFiles;

		readDir(absolutePath)

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

	const isMdFile = (absolutePath) => {

		readFile(absolutePath)

			.then((file) => {

				getLinks(file);

				if (matchedLinks === null) {

					return console.log('\n\tNo links were found in the (*.md) file.\n');

				} else {

					parseLinks(matchedLinks);

					validateAllLinks(parsedLinksCollection);

					validateLink(linkString);

				}

			})

			.catch((error) => {

				console.log(error);

			});

	};

	const fileOrDir = (absolutePath) => {

		if (path.extname(absolutePath).length > 0) {

			if (path.extname(absolutePath) === '.md') {

				isMdFile(absolutePath);

			} else {

				console.log(`\n\tYou must provide a valid markdown (*.md) file.\n`);

			}

		} else if (path.extname(absolutePath) === '') {

			isDir(absolutePath);

		} else {

			console.log(`\n\tYou must provide a valid path to an (*.md) file or directory.\n`);

		}

	};

	const validateOptions = (options) => {

		if (options[0] === undefined) {

			printLinks(parsedLinksCollection);

		}

	};

	const validatePath = (givenPath) => {

		if (givenPath === undefined) {

			console.log(`\n\tYou must provide a path to a markdown (*.md) file.\n`);

		}

		let absolutePath = path.resolve(cwd, givenPath);

		if (fs.existsSync(absolutePath)) {

			fileOrDir(absolutePath);

		} else {

			console.log('\n\tThe provided path does not exist.\n');

		}

	};

	validatePath(givenPath, options);

};