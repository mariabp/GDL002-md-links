module.exports = (givenPath, options) => {

	const fs = require('fs');
	const path = require('path');
	const http = require('http');

	const errors = {

		noFilePath:

			`\n\tYou must provide a path to a markdown (*.md) file.\n`,

		noValidPath:

			`\n\tYou must provide a valid path to a markdown (*.md) file.\n`,

		noMarkdownFiles:

			`\tERROR! There are no markdown (*.md) files on the provided directory.\n`,

		markdownFilesOnly:

			`\tERROR! Only markdown (*.md) files can be used with md-links.\n`
	};

	const getDirectoryFiles = (absolutePath) => {

		fs.readdir(absolutePath, 'utf8', (err, files) => {

			if (err) {

				console.log(err);

			}

			let fileList = files.filter((file) => {

				if (path.extname(file) === '.md') {

					return file;

				}

			});

			if (fileList === 0) {

				console.log(errors.noMarkdownFiles);

			} else {

				fileList.forEach((file) => {

					console.log(`\t${file}`);

				});

				console.log(`\n\t${fileList.length} markdown (*.md) file(s) found in total.\n`);

			}

		});

	};

	const getFileLinks = (absolutePath) => {

		fs.readFile(absolutePath, 'utf8', (err, file) => {

			if (err) {

				console.log(err);

			}

			const regExpLinks = /(http|https)+:{1}(\/){2}([\w\-:\.])+[\w\-\/=]*[^ \.]\b/giu;

			let linkCollection = file.match(regExpLinks);

			linkCollection.forEach((linkText) => {

				console.log(`\t${linkText}`);

			});

			console.log(`\n\t${linkCollection.length} links were found in total.\n`);

		});

	};


	const validateArguments = () => {

		const validatePath = () => {

			if (givenPath === undefined) {

				console.log(errors.noFilePath);

			} else if (path.isAbsolute(givenPath)) {

				let absolutePath = givenPath;

				console.log(`\n\t${absolutePath}\n`);

				if (/(\w)+:/.test(absolutePath)) {

					path.normalize(absolutePath);

				}

				if (path.extname(absolutePath) === '.md') {

					getFileLinks(absolutePath);

				} else if (path.extname(absolutePath) === '') {

					getDirectoryFiles(absolutePath);

				} else {

					console.log(errors.markdownFilesOnly);

				}

			} else {

				console.log(errors.noValidPath);

			}

		};

		validatePath(givenPath);

		if (options.length > 0) {

			options.forEach((element) => {

				if (/(\-\-validate)/gi.test(element)) {

					validateLinks();

				} else if (/(\-\-stats)/gi.test(element)) {

					linksStats();

				}

			});

		}

	};

	validateArguments(givenPath, options);

};