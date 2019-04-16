#!/usr/bin/env node

'use strict';

const mdLinks = require('../index');

const givenPath = process.argv[2];
const options = [process.argv[3], process.argv[4]];

mdLinks(givenPath, options);