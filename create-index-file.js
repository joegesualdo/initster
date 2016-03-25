var fs = require("fs");

function generateIndexFileString() {
  return `"use strict";`
}

function createIndexFile() {
  fs.writeFile(process.cwd() + '/index.js', generateIndexFileString(), (err) => {
    if (err) throw err;
  });
}

module.exports = createIndexFile;
