const { src } = require("gulp")

function task1(done) {
  console.log('task1 is completed!')
  done()
}

function task2() {
  return src('./digits.txt')
}

exports.task1 = task1;
exports.task2 = task2;