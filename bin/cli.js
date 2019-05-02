#!/usr/bin/env node

'use strict';

const mdLinks = require('../src/index');

const givenPath = process.argv[2];

const optionOne = process.argv[3];

const optionTwo = process.argv[4];

let options = [optionOne, optionTwo];


const truncateLinkText = (link) => {

	if (link.length > 52) {

		let getText = link.slice(1, 49);

		let truncatedText = `[${getText.substring(0, 45)}...]`;

		return truncatedText;


	} else {

		return link;

	}

};

const printLinks = (givenLinksCollection) => {

	console.log(`\n\t\t \u001b[1m Path:${givenPath} \x1b[0m\n`);

	if (givenLinksCollection.isValidate) {

		let truncatedLinkText = "";

		givenLinksCollection.validatedLinksCollection.forEach((element) => {

			if (element.error) {

				truncatedLinkText = truncateLinkText(element.givenLink.linkText);

				console.log(`\t--- ERROR --- \u001b[1m${truncatedLinkText}\x1b[0m ${element.givenLink.linkUrlString} (${element.error}) \u001b[4mLine: ${element.lineNumber}. \x1b[0m\n`);

			} else {

				truncatedLinkText = truncateLinkText(element.linkText);

				console.log(`\t\u001b[1m${truncatedLinkText}\x1b[0m ${element.linkUrlString} ( ${element.statusCode} ${element.statusMessage} ) \u001b[4mLine: ${element.lineNumber} \x1b[0m\n`);

			}

		});

	} else if (givenLinksCollection.isStats) {

		console.log(`\t\t\u001b[1m${givenLinksCollection.uniqueLinksCollection.length}\x1b[0m unique link(s) found in total.\n`);

	} else if (givenLinksCollection.isValidateStats) {

		console.log(`\t\t\u001b[1m${givenLinksCollection.uniqueLinksCollection.length}\x1b[0m unique link(s) found in total.\n`);

		console.log(`\t\t\u001b[1m${givenLinksCollection.brokenLinksCollection.length}\x1b[0m broken link(s) found in total.\n`);

	} else {

		givenLinksCollection.parsedLinksCollection.forEach((element) => {

			let truncatedLinkText = truncateLinkText(element.linkText);

			console.log(`\t\u001b[1m${truncatedLinkText}\x1b[0m ${element.linkUrlString} \u001b[4mLine: ${element.lineNumber} \x1b[0m\n`);

		});

	}

	console.log(`\t\t\u001b[1m${givenLinksCollection.parsedLinksCollection.length}\x1b[0m link(s) found in total.\n`);

};

mdLinks(givenPath, options)

	.then((givenCollections) => {

		printLinks(givenCollections);

	});