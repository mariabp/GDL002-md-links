#!/usr/bin/env node
'use strict'

const mdLinks = require("./index");

const path = process.argv[2];
const options = [process.argv[3], process.argv[4]];

mdLinks(path, options);