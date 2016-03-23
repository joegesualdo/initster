var Promise = require('bluebird');
const readline = require('readline');

var package = {}

var questions = [
  {
    prompt: "What's the name?",
    onEnter: function(answer) {
      package.name = answer;
    }
  },
  {
    prompt: "What version",
    onEnter: function(answer) {
      package.version = answer;
    }
  },
]

function askQuestion(question) {
  return new Promise(function(resolve, reject){
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    rl.question(question.prompt + ": ", function(answer) {
      question.onEnter(answer)
      rl.close();
      // Dont try to execute the callback if it does't exist
      resolve(package)
    })
  })
}

function askQuestions(questions, questionIndex) {
  if (questionIndex >= questions.length) {
    return;
  } else {
    var currentIndex = questionIndex || 0
    askQuestion(questions[currentIndex]).then(function(package){
      askQuestions(questions, currentIndex + 1)
    })
  }
}
askQuestions(questions)
