#!/usr/bin/env node

const path = require("path");

const entry = path.resolve(__dirname, "./tsDist/srcBuilder/ww2_build_promp.js");

require(entry);