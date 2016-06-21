var fs = require("fs");
var convertToCamelcase = require('convert-to-camelcase').default

function generateReadmeString(package) {
  return `## ${package.name} [![Build Status](https://travis-ci.org/${package.repository}.svg?branch=master)](https://travis-ci.org/${package.repository})
> ${package.description}

## Install
\`\`\`
$ npm install --save ${package.name} 
\`\`\`

## Usage
\`\`\`javascript
var ${convertToCamelcase(package.name)} = require("${package.name}").default

// insert code example here
\`\`\`

## Test
\`\`\`
$ npm test
\`\`\`

## API
### \`methodName(arg1, arg2)\`
> What does this method do?

| Name | Type | Description |
|------|------|-------------|
| arg1 | \`Array\` | Test description|
| arg2 | \`String\` | Test description|

Returns: \`Array\`, of things

\`\`\`javascript
var ${convertToCamelcase(package.name)} = require("${package.name}").default

// insert method example here
\`\`\`

## Related
- [example-package]() - Add description of the example package here.

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
