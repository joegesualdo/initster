var fs = require("fs");
function generateTravisString() {
  return `language: node_js
node_js:
  - '5'
  - '4'
  - '0.12'
  - '0.10'
`
}

function createTravisFile(package) {
  fs.writeFile(process.cwd() + '/.travis.yml', generateTravisString(), (err) => {
    if (err) throw err;
  });
}

module.exports = createTravisFile;
