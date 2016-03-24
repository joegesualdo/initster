var fs = require("fs");
var Promise = require('bluebird');
const readline = require('readline');
var jsonfile = require('jsonfile')

var projectName = process.cwd().split("/").pop()

var questions = [
  {
    prompt: "Name: (" + projectName + ")",
    onEnter: function(answer, package) {
      package.name = answer || projectName;
      return package;
    }
  },
  {
    prompt: "Version: (1.0.0)",
    onEnter: function(answer, package) {
      package.version = answer || "1.0.0";
      return package;
    }
  },
  {
    prompt: "Description:",
    onEnter: function(answer, package) {
      package.description = answer;
      return package;
    }
  },
  {
    prompt: "Entry Point: (index.js)",
    onEnter: function(answer, package) {
      package.main = answer || "index.js";
      return package;
    }
  },
  {
    prompt: "Test Command:",
    onEnter: function(answer, package) {
      package['scripts'] = {test: answer || "mocha test.js"}
      return package;
    }
  },
  {
    prompt: "Git Repository:",
    onEnter: function(answer, package) {
      package.repository = answer;
      return package;
    }
  },
  {
    prompt: "Keywords:",
    onEnter: function(answer, package) {
      // split and remove empty strings
      package.keywords = answer.split(",").filter(function(e){return e});
      return package;
    }
  },
  {
    prompt: "Author:",
    onEnter: function(answer, package) {
      package.author = {name: answer};
      return package;
    }
  },
  {
    prompt: "License: (MIT)",
    onEnter: function(answer, package) {
      package.license = answer || "MIT";
      return package;
    }
  },
  {
    prompt: "devDependencies:",
    onEnter: function(answer, package) {
      package.devDependencies = {}
      // split and remove empty strings
      answer.split(",").filter(function(e){return e}).forEach(function(dep){
        package.devDependencies[dep] = "*"
      })
      package.devDependencies["mocha"] = "*"
      package.devDependencies["chai"] = "*"
      return package;
    }
  },
  {
    prompt: "Dependencies:",
    onEnter: function(answer, package) {
      package.dependencies = {}
      // split and remove empty strings
      answer.split(",").filter(function(e){return e}).forEach(function(dep){
        package.dependencies[dep] = "*"
      })
      return package;
    }
  }
]

function askQuestion(question, startingPackage) {
  return new Promise(function(resolve, reject){
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    rl.question(question.prompt + " ", function(answer) {
      var package = question.onEnter(answer, startingPackage)
      rl.close();
      resolve(merge_options(package))
    })
  })
}

// startingPackage is the object you want to add the package
//   key values to
function askQuestions(questions, startingPackage) {
  startingPackage = startingPackage || {}
  return new Promise(function(resolve, reject){
    var promises = questions.map(function(question){
      return askQuestion.bind(null, question, startingPackage)
    })
    promiseChain(promises).then(function(package){
      resolve(merge_options(startingPackage, package))
    })
  })
}

function promiseChain(promiseArray) {
  return new Promise(function(resolve, reject){
    var currentIndex = 0
    function next(passedVal) {
      currentIndex++
      if (currentIndex >= promiseArray.length) {
        resolve(passedVal)
      } else {
        promiseArray[currentIndex]().then(function(passedVal){
          next(passedVal);
        })
      }
    }
    promiseArray[currentIndex]().then(function(passedVal){
      next(passedVal);
    })
  })
}

function merge_options(obj1,obj2){
  var obj3 = {};
  for (var attrname in obj1) { obj3[attrname] = obj1[attrname]; }
  for (var attrname in obj2) { obj3[attrname] = obj2[attrname]; }
  return obj3;
}

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

function generateTravisString() {
  return `language: node_js
node_js:
  - '5'
  - '4'
  - '0.12'
  - '0.10'
`
}

function generateIndexFileString() {
  return `"use strict";`
}

function generateMochaTestFile(package) {
  fs.writeFile(process.cwd() + '/test.js', generateMochaTestFileString(package), (err) => {
    if (err) throw err;
  });
}
function createIndexFile() {
  fs.writeFile(process.cwd() + '/index.js', generateIndexFileString(), (err) => {
    if (err) throw err;
  });
}

function createTravisFile(package) {
  fs.writeFile(process.cwd() + '/.travis.yml', generateTravisString(), (err) => {
    if (err) throw err;
  });
}

function createReadme(package) {
  fs.writeFile(process.cwd() + '/readme.md', generateReadmeString(package), (err) => {
    if (err) throw err;
  });
}


askQuestions(questions).then(function(package){
  var file = process.cwd() + '/package.json'

  jsonfile.writeFile(file, package, {spaces: 2}, function(err) {
  })
  return package
}).then(function(package){
  createReadme(package)
  createTravisFile()
  createIndexFile()
  generateMochaTestFile(package)
})

