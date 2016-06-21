var exec = require('child_process').exec;
function createGit(projectPath, callback) {
  console.log(projectPath)
  process.chdir(projectPath);
  exec("git init",function(error, stdout, stderr){
    console.log(stdout)
    exec("git add .",function(error, stdout, stderr){
      console.log(stdout)
      exec("git commit -m 'Initial Commit'",function(error, stdout, stderr){
        callback()
        console.log(stdout)
      });
    });
  });
}

module.exports = createGit;
