#!/usr/bin/env node
// 3rd party dependencies
var fs = require("fs");
var path  = require('path');
var dotenv = require('dotenv')
var mkdirp = require('mkdirp');
var Promise = require('bluebird');
var readline = require('readline');
var jsonfile = require('jsonfile');
var parseArgs = require('parse-argv');
var exec = require('child_process').exec;

// Imports
var createGit = require("./createGit.js")
var promiseChain = require("./promise-chain")
var mergeOptions = require("./merge-options")
var getQuestions = require("./get-questions")
var createReadme = require("./create-readme")
var createIndexFile = require('./create-index-file');
var createTravisFile = require("./create-travis-file");
var createGithubRepo = require('./createGithubRepo.js');
var createGitignoreFile = require('./create-gitignore-file');
var createAvaTestFile = require('./createAvaTestFile');

// dotevn configuration
dotenv.config({path: __dirname + "/.env", silent: true});

// Parse command line options
var args = process.argv.slice(2);
var argv = parseArgs(args)

if (!argv['type']){
  console.log("Must specify a project type option (I.e $ initster --type=es6)")
  return
}
if (argv['type'] !== 'es6'){
  console.log("At the current time, npm-better-init only supports es6 projects (I.e $ ni --type=es6)")
  return
}

// $ initster config
if (args[0] == 'config') {
  var config_args = process.argv.slice(1);
  var config_argv = parseArgs(args)
  // $ initster config --github-tocken=...
  if (config_argv['github-username']) {
    var username = config_argv['github-username']
    try {
      var logger = fs.createWriteStream(`${__dirname}/.env`, {
        flags: 'a' // 'a' means appending (old data will be preserved)
      })

      logger.write(`GITHUB_USERNAME=${username}\n`)
      logger.end()
      console.log('Your Github username has been saved.');
      dotenv.load();
      // fs.appendFile(`${__dirname}/.env`, `GITHUB_USERNAME=${username}\n`, function(){
      //   console.log('It\'s saved!');
      //   dotenv.load();
      // })
    } catch(error) {
      throw error
    } finally {
    }
  }
  if (config_argv['github-token']) {
    var token = config_argv['github-token']
    try {
      var logger = fs.createWriteStream(`${__dirname}/.env`, {
        flags: 'a' // 'a' means appending (old data will be preserved)
      })

      logger.write(`GITHUB_TOKEN=${token}\n`)
      logger.end()
      console.log('Your Github token has been saved.');
      dotenv.load();
      // fs.appendFile(`${__dirname}/.env`, `GITHUB_TOKEN=${token}\n`, function() {
      // console.log('It\'s saved!');
      // dotenv.load();
      // })
    } catch(error) {
      throw error
    } finally {
    }
  }
  return;
}

var shouldCreateGithubRepo = false;
if (argv['g']) {
  shouldCreateGithubRepo = true;
}

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
    return process.cwd() + "/" + argv['_'][0];
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
  var questions = getQuestions(process.env['GITHUB_USERNAME'], projectName)
  askQuestions(questions).then(function(package){
    package['scripts']["build"] = "./node_modules/distify-cli/cli.js --input-file=./index.js --output-dir=./dist";
    package['scripts']["prepublish"] = "npm run build";
    var file = process.cwd() + '/package.json'

    jsonfile.writeFile(file, package, {spaces: 2}, function(err) {
    })
    return package
  }).then(function(package){
    createTravisFile()
    createIndexFile()
    createGitignoreFile()
    createAvaTestFile(package)
    installDependencies(function(){
      console.log("Done installing dependencies")
    })
    createGit(projectPath, function() {
      if (shouldCreateGithubRepo) {
        console.log("triggered")
        createGithubRepo(package.name, {
          token: process.env['GITHUB_TOKEN']
        }, function(err) {
          if (err) {
          } else {
            var repoName = package.repository.split('/').pop()
            addGitRemote(process.env['GITHUB_USERNAME'], repoName, function() {
              createReadme(package)
              createTravisProj(process.env['GITHUB_USERNAME'], repoName)
            });
          }
        })
      }
    })
  })
}

function addGitRemote(username, repo, callback) {
  exec(`git remote add origin git@github.com:${username}/${repo}.git`,function(error, stdout, stderr){
    console.log(stdout)
    exec('git push -u origin master' ,function(error, stdout, stderr){
      callback()
    })
  })
}

function installDependencies(callback) {
  console.log("installing dependencies")
  exec(`npm install`,function(error, stdout, stderr){
    console.log(stdout)
    exec('git push -u origin master' ,function(error, stdout, stderr){
      callback()
    })
  })
}

function createTravisProj(githubUsername, repo) {
  // What if user doesn't have the travis command line?
  exec(`travis login --github-token=${process.env['GITHUB_TOKEN']}`,function(error, stdout, stderr){

    console.log(stdout)
    exec(`travis enable -r ${githubUsername}/${repo}`, function(error, stdout, stderr) {
      console.log(stdout)
    })
  })
}
