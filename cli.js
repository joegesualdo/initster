#!/usr/bin/env node
var fs = require("fs");
var Promise = require('bluebird');
const readline = require('readline');
var jsonfile = require('jsonfile')

var promiseChain = require("./promise-chain")
var mergeOptions = require("./merge-options")
var questions = require("./questions")
var createTravisFile = require("./create-travis-file");
var createReadme = require("./create-readme")
var generateMochaTestFile = require('./create-mocha-test-file');
var createIndexFile = require('./create-index-file');

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
//   key/values pairs to.
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

