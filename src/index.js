module.exports = (givenPath, options) => {

	const fs = require('fs');
	const path = require('path');
	const url = require('url');

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

	const getLinks = (file) => {

		const matchLinks = /\[([^[])+\]\(([^)])+\)/giu;

		let matchedLinks = file.match(matchLinks);

		console.log(`\t${linkCollection.length} links were found in total.\n`);

		let linkCollection = matchedLinks.map((link) => {

			const matchText = /\[([^[])+\]/giu;
			let linkText = link.match(matchText);

			const matchURL = /(http|https)+:{1}(\/){2}([\w\-:\.])+[\w\-\/=]*[^ \.]\b/giu;
			let linkURL = link.match(matchURL);

			let linkString = linkURL.toString();

			const linkInfo = [linkText, linkString];

			return linkInfo;

		});

	};

	const readDir = (absolutePath) => {

		return new Promise((resolve, reject) => {

			fs.readdir(absolutePath, 'utf8', (err, files) => {

				return err ? reject(err) : resolve(files);

			});

		});

	};

	const printFilteredFiles = (filteredFiles) => {

		filteredFiles.forEach((file) => {

			console.log(`\t${file}\n`);

		});

	};

	const filterFiles = (files) => {

		let filteredFiles = files.filter(file => {

			if (path.extname(file) === ".md") {

				return file;

			}

		});

		return filteredFiles;

	};

	const isDir = (absolutePath) => {

		filteredFiles;

		readDir(absolutePath)

			.then((files) => {

				filterFiles(files);
				printFilteredFiles(filteredFiles);

			})

			.catch((error) => {

				console.log(error);

			});

	};

	const readFile = (absolutePath) => {

		return new Promise((resolve, reject) => {

			fs.readFile(absolutePath, 'utf8', (err, file) => {

				return err ? reject(err) : resolve(file);

			});

		});

	};

	const isFile = (absolutePath) => {

		readFile(absolutePath)

			.then((file) => {

				getLinks(file);

				validateLink(linkInfo[1])

					.then((response) => {

						console.log(`\t${linkInfo[0]} ${linkInfo[1]} ( ${response.statusCode} ${response.statusMessage} )\n`);

					})

					.catch((error) => {

						console.log(error);

					});

			})

			.catch((error) => {

				console.log(error);

			});

	};

	const fileOrDir = (absolutePath) => {

		if (path.extname(absolutePath).length > 0) {

			if (path.extname(absolutePath) === '.md') {

				isFile(absolutePath);

			} else {

				console.log(`\n\tYou must provide a valid markdown (*.md) file.\n`);

			}

		} else if (path.extname(absolutePath) === '') {

			isDir(absolutePath);

		} else {

			console.log(`\n\tYou must provide a valid path to an (*.md) file or directory.\n`);

		}

	};

	const validatePath = (givenPath) => {

		if (givenPath === undefined) {

			console.log(`\n\tYou must provide a path to a markdown (*.md) file.\n`);

		} else if (path.isAbsolute(givenPath)) {

			let absolutePath = givenPath;

			path.normalize(absolutePath);

			console.log(`\n\t${absolutePath}\n`);

			fileOrDir(absolutePath);

			return absolutePath;

		}

	};

	validatePath(givenPath);

};