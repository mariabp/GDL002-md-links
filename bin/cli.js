#!/usr/bin/env node

'use strict';

const mdLinks = require('../src/index');

const givenPath = process.argv[2];

const optionOne = process.argv[3];

const optionTwo = process.argv[4];

let options = [optionOne, optionTwo];


const truncateLinkText = (givenLink) => {

	if (givenLink.length > 52) {

		let getText = givenLink.slice(1, 49);

		let truncatedText = `[${getText.substring(0, 45)}...]`;

		return truncatedText;


	} else {

		return givenLink;

	}

};

const printLinks = (givenLinksCollection) => {

	console.log(`\n\t\t \u001b[1m Path:${givenPath} \x1b[0m\n`);

	if (givenLinksCollection.isValidate) {

		givenLinksCollection.validatedLinksCollection.forEach((element) => {

			let truncatedLinkText = truncateLinkText(element.linkText);

			if (element.error) {

				console.log(`\t--- ERROR --- ${truncatedLinkText} ${element.givenLink.linkUrlString} ( ${element.error} ).\n`);

			} else {

				console.log(`\t${truncatedLinkText} ${element.linkUrlString} ( ${element.statusCode} ${element.statusMessage} )\n`);

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

			console.log(`\t${truncatedLinkText} ${element.linkUrlString}\n`);

		});

	}

	console.log(`\t\t\u001b[1m${givenLinksCollection.parsedLinksCollection.length}\x1b[0m link(s) found in total.\n`);

};

mdLinks(givenPath, options)

	.then((givenCollections) => {

		printLinks(givenCollections);

	});