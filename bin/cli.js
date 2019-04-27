#!/usr/bin/env node

'use strict';

const mdLinks = require('../src/index');

const givenPath = process.argv[2];

const optionOne = process.argv[3];

const optionTwo = process.argv[4];

const options = [optionOne, optionTwo];


const printLinks = (givenCollections) => {

	let parsedLinksCollection = givenCollections.parsedLinksCollection;
	let validatedLinksCollection = givenCollections.validatedLinksCollection;
	let uniqueLinksCollection = givenCollections.uniqueLinksCollection;
	let brokenLinksCollection = givenCollections.brokenLinksCollection;

	console.log(`\n\tPath:${givenPath}\n`);

	if (validatedLinksCollection !== undefined && uniqueLinksCollection === undefined && brokenLinksCollection === undefined) {

		validatedLinksCollection.forEach((link) => {

			if (link.error) {

				console.log(`\t${link.error.code}`);

			} else {

				console.log(`\t${validatedLinksCollection.linkText} ${validatedLinksCollection.linkURL} ( ${validatedLinksCollection.statusCode} ${validatedLinksCollection.statusMessage} )\n`);

			}

		});

	} else if (uniqueLinksCollection !== undefined && brokenLinksCollection === undefined && validatedLinksCollection === undefined) {

		console.log(`\t${uniqueLinksCollection.length} unique link(s) found.\n`);

	} else if (validatedLinksCollection !== undefined && brokenLinksCollection !== undefined && uniqueLinksCollection !== undefined) {

		console.log(`\t${uniqueLinksCollection.length} unique link(s) found.\n`);
		console.log(`\t${brokenLinksCollection.length} broken link(s) found.\n`);

	} else {

		parsedLinksCollection.forEach((link) => {

			console.log(`\t${parsedLinksCollection.linkText} ${parsedLinksCollection.linkURL})\n`);

		});

	}

	console.log(`\t${parsedLinksCollection.length} link(s) found in total.\n`);

};

mdLinks(givenPath, options)

	.then((givenCollections) => {

		printLinks(givenCollections);

	});