#!/usr/bin/env node

'use strict';

const mdLinks = require('../src/index');

const givenPath = process.argv[2];

const optionOne = process.argv[3];

const optionTwo = process.argv[4];

let options = [optionOne, optionTwo];


const truncateLinkText = (givenLink) => {

	if (givenLink[0].length > 52) {

		let regExp = /[^\[]+(?=\])/gi;

		let getText = givenLink[0].match(regExp);

		let truncatedText = `[${getText[0].substring(0, 45)}]`;

		return truncatedText;


	} else {

		return givenLink[0];

	}

};

const printLinks = (givenLinksCollection) => {


	console.log(`\n\t\tPath: ${givenPath}\n`);

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

		console.log(`\t\t${givenLinksCollection.uniqueLinksCollection.length} unique link(s) found in total.\n`);

	} else if (givenLinksCollection.isValidateStats) {

		console.log(`\t\t${givenLinksCollection.uniqueLinksCollection.length} unique link(s) found in total.\n`);

		console.log(`\t\t${givenLinksCollection.brokenLinksCollection.length} broken link(s) found in total.\n`);

	} else {

		givenLinksCollection.parsedLinksCollection.forEach((element) => {

			let truncatedLinkText = truncateLinkText(element.linkText);

			console.log(`\t${truncatedLinkText} ${element.linkUrlString}\n`);

		});

	}

	console.log(`\t\t${givenLinksCollection.parsedLinksCollection.length} link(s) found in total.\n`);

};

mdLinks(givenPath, options)

	.then((givenCollections) => {

		printLinks(givenCollections);

	});