var fs = require("fs");

function generateGitignoreString(package) {
  return `node_modules`
}

function createGitignoreFile(){
  fs.writeFile(process.cwd() + '/.gitignore', generateGitignoreString(), (err) => {
    if (err) throw err;
  });
}

module.exports = createGitignoreFile;
