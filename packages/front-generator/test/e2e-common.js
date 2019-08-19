const path = require('path');
const {promisify} = require('util');
const exec = promisify(require('child_process').exec);

function runGenerator(name, dest, answersJSONString, dirShift, modelFile = 'projectModel2.json') {
  const pathToModel = path.join(process.cwd(), 'test', modelFile);

  let command = `node bin/gen-cuba-front ${name} --model ${pathToModel}`;
  if (dest) {
    command += ` --dest ${dest}`;
  }
  if (answersJSONString) {
    const encodedAnswers = Buffer.from(answersJSONString).toString('base64');
    command += ` --answers ${encodedAnswers}`;
  }
  if (dirShift) {
    command += ` --dirShift ${dirShift}`
  }
  console.log(command);
  return exec(command);
}

module.exports = {
  runGenerator: runGenerator
};