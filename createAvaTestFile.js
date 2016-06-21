var fs = require("fs");

function generateAvaTestFileString(package) {
  return `import test from 'ava';
import ${package.name} from './dist'

test(t => {
    t.deepEqual([1, 2], [1, 2]);
});
`
}

function createAvaTestFile(package) {
  fs.writeFile(process.cwd() + '/test.js', generateAvaTestFileString(package), (err) => {
    if (err) throw err;
  });
}

module.exports = createAvaTestFile;
