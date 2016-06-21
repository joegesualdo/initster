var GitHubApi = require("github");
var github = new GitHubApi();

function createGithubRepo(name, opts, callback) {
  opts = opts || {}
  if (!name) {
    console.log("Error creating repo: name was not provided");
    return;
  }
  if (!opts.token) {
    console.log("Error creating repo: oauth token was not provided");
    return;
  }
  github.authenticate({
    type: "oauth",
    token: opts.token
  });

  github.repos.create({
    name: name
  }, function(error, res){
    if (error) {
      console.log("Error creating repo: " + error);
      callback(new Error("Error creating repo"));
    }
    console.log("Repo '" + name + "' was successfully created.");
    callback(null, "Success");
  });
}

module.exports = createGithubRepo;
