#!/usr/bin/env node

const path = require("path");

const entry = path.resolve(__dirname, "./dist/node/builder/builder_promps.js");

require(entry);