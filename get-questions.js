function getQuestions(projectName) {
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
      prompt: "Entry Point: (index.js)",
      onEnter: function(answer, package) {
        package.main = answer || "index.js";
        return package;
      }
    },
    {
      prompt: "Test Command:",
      onEnter: function(answer, package) {
        package['scripts'] = {
          test: answer || "mocha test.js"
        }
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
        package.devDependencies["distify-cli"] = "0.0.2"
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
