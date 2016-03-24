var fs = require("fs");

function generateReadmeString(package) {
  return `## ${package.name} [![Build Status](https://travis-ci.org/${package.repository}.svg?branch=master)](https://travis-ci.org/${package.repository})
> ${package.description}

## Install
\`\`\`
$ npm install --save ${package.name} 
\`\`\`

## Usage
\`\`\`
var ${package.name} = require("${package.name}")

// insert code example here
\`\`\`

## Test 
\`\`\`
$ npm test
\`\`\`

## License
MIT © [${package.author.name}]()
`
}

function createReadme(package) {
  fs.writeFile(process.cwd() + '/readme.md', generateReadmeString(package), (err) => {
    if (err) throw err;
  });
}

module.exports = createReadme;
