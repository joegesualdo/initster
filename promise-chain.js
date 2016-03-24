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

module.exports = promiseChain;
