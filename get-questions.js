function getQuestions(repoName, projectName) {
  return [
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
      prompt: "Entry Point: (./dist/index.js)",
      onEnter: function(answer, package) {
        package.main = answer || "./dist/index.js";
        return package;
      }
    },
    {
      prompt: "Test Command: ($ ava test.js)",
      onEnter: function(answer, package) {
        package['scripts'] = {
          test: answer || "./node_modules/ava/cli.js -v test.js"
        }
        return package;
      }
    },
    {
      prompt: `Github Repository name: (${repoName}/<REPO_NAME>)`,
      onEnter: function(answer, package) {
        package.repository = `${repoName}/${answer}`;
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
        package.devDependencies["ava"] = "^0.15.2"
        package.devDependencies["distify-cli"] = "0.0.5"
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
}

module.exports = getQuestions;
