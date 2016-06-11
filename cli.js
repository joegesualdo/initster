#!/usr/bin/env node
var fs = require("fs");
var Promise = require('bluebird');
var path  = require('path');
var readline = require('readline');
var jsonfile = require('jsonfile');
var parseArgs = require('parse-argv');
var mkdirp = require('mkdirp');

var args = process.argv.slice(2);
var argv = parseArgs(args)


var promiseChain = require("./promise-chain")
var mergeOptions = require("./merge-options")
var getQuestions = require("./get-questions")
var createTravisFile = require("./create-travis-file");
var createReadme = require("./create-readme")
var generateMochaTestFile = require('./create-mocha-test-file');
var createIndexFile = require('./create-index-file');
var createGitignoreFile = require('./create-gitignore-file');

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
function getProjectPath() {
  if (argv['_'] && argv['_'][0]) {
    return argv['_'][0];
  } else {
    return process.cwd();
  }
}

function getProjectName(projectPath) {
  path = projectPath;
  if (path[path.length - 1] === "/"){
    path = path.substring(0, path.length - 1);
  }
  return path.split("/").pop();
}

var projectPath = getProjectPath();
var projectName = getProjectName(projectPath);
if (projectPath !== process.cwd()) {
  console.log(argv)
  mkdirp(projectPath, function (err) {
    if (err) {
      console.error("There was an error with the project path specified: " + err)
      return;
    } else {
      process.chdir(projectPath);
      main(projectName);
    }
  });
} else {
  main(projectName);
}

function main(projectName){
  var questions = getQuestions(projectName)
  askQuestions(questions).then(function(package){
    package['scripts']["build"] = "./node_modules/distify-cli/cli.js --input-file=./index.js --output-dir=./dist"
    var file = process.cwd() + '/package.json'

    jsonfile.writeFile(file, package, {spaces: 2}, function(err) {
    })
    return package
  }).then(function(package){
    createReadme(package)
    createTravisFile()
    createIndexFile()
    createGitignoreFile()
    generateMochaTestFile(package)
  })
}

