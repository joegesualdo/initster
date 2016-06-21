var fs = require("fs");
function generateTravisString() {
  return `language: node_js
node_js:
  - '6.2.1'
`
}

function createTravisFile(package) {
  fs.writeFile(process.cwd() + '/.travis.yml', generateTravisString(), (err) => {
    if (err) throw err;
  });
}

module.exports = createTravisFile;
