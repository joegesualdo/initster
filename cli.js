#!/usr/bin/env node

var fs = require("fs");
var Promise = require('bluebird');
const readline = require('readline');
var jsonfile = require('jsonfile')
var promiseChain = require("./promise-chain")
var mergeOptions = require("./merge-options")

var questions = require("./questions")

var createTravisFile = require("./create-travis-file")
var createReadme = require("./create-readme")

function askQuestion(question, startingPackage) {
  return new Promise(function(resolve, reject){
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    rl.question(question.prompt + " ", function(answer) {
      var package = question.onEnter(answer, startingPackage)
      rl.close();
      resolve(mergeOptions(package))
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
      resolve(mergeOptions(startingPackage, package))
    })
  })
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

