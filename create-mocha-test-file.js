var fs = require("fs");

function generateMochaTestFileString(package) {
  return `var expect = require("chai").expect
var ${package.name} = require("./index")

describe("Sample", function(){
  it("sample", function(){
    expect(true).to.equal(false)
  })
})
`
}

function generateMochaTestFile(package) {
  fs.writeFile(process.cwd() + '/test.js', generateMochaTestFileString(package), (err) => {
    if (err) throw err;
  });
}

module.exports = generateMochaTestFile;
