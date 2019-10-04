const path = require('path');
const assert = require('assert');
const {promisify} = require('util');
const exec = promisify(require('child_process').exec);
const fs = require('fs');

const EXPECT_DIR = 'test/e2e/expect';
const GENERATED_DIR = 'test/e2e/generated';
const LOG_DIR = `${GENERATED_DIR}/logs`;

module.exports = function (generatorName, logFileSuffix) {

  let logFileName;

  function init() {

    //check 'generated' dir - create if need
    !fs.existsSync(GENERATED_DIR) && fs.mkdirSync(GENERATED_DIR);

    logFileName = path.join(LOG_DIR, generatorName.split(':')[0] + `:${logFileSuffix}` + '.log');
    console.info(`init integration test '${generatorName}', logs will be available at`, logFileName);

    //create logs dir if not exist
    !fs.existsSync(LOG_DIR) && fs.mkdirSync(LOG_DIR);
    //truncate log file
    fs.existsSync(logFileName) && fs.truncateSync(logFileName);
  }

  function logInfo(message) {
    fs.appendFileSync(logFileName, message + '\n');
  }

  function logErr(message) {
    fs.appendFileSync(logFileName, message + '\n');
  }

  //todo problems with projectModel path
  function runGenerator(moduleName, dest, answersJSONString, dirShift, modelFile = 'projectModel2.json') {
    const pathToModel = path.join(process.cwd(), 'test', modelFile);

    let command = `node bin/gen-cuba-front ${generatorName}:${moduleName} --model ${pathToModel}`;
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

    return cmd(command,
      `e2e:test: start generator '${generatorName}' by running '${command}'`,
      `e2e:test: generation ${generatorName} - DONE`);
  }

  function cmd(command, startMessage, doneMessage) {
    if (startMessage) logInfo(startMessage);
    return exec(command)
      .then((onful, onreject) => {
        return logOutput(onful, onreject, doneMessage)
      }).catch((err) => {
        logOutput(undefined, err, `Error: Command failed: ${command}`);
        throw err;
      });
  }

  function logOutput(onful, onreject, comment) {
    if (onful && onful.stdout) logInfo(onful.stdout);
    if (onful && onful.stderr) logErr(onful.stderr);
    if (onreject && onreject.stdout) logInfo(onreject.stdout);
    if (onreject && onreject.stderr) logErr(onreject.stderr);

    logInfo(comment);
  }

  function assertContent(filePath, moduleDir, multiline = true) {

    const expectFilePath = path.join(EXPECT_DIR, filePath);
    const actualFilePath = path.join(moduleDir, filePath);

    const content = fs.readFileSync(actualFilePath, 'utf8');
    const expect = fs.readFileSync(expectFilePath, 'utf8');

    assert.strictEqual(drain(content, multiline), drain(expect, multiline));
    logInfo(`e2e: assert file ${actualFilePath} with expect gauge ${expectFilePath} - PASSED`);
  }

  function drain(content, multiline = true) {
    const result = multiline
      ? content
        .replace(/^\s+/gm, '') //spaces at the line start, and empty lines
      : content
        .replace(/\n/g, ' ');  //multiline false - join in one line

    return result
      .replace(/\s{2,}/g, ' ') //two or more spaces with one space
      .trim();
  }


  async function installAndBuild(suffix, appDir) {
    const logCaption = `e2e:react-client:${suffix}:`;
    console.log(`${logCaption} generation complete, start compilation`);

    await cmd(`cd ${appDir} && npm install`,
      `${logCaption} start compile react-client after generation  - npm install, path: ${fs.realpathSync(appDir)}`,
      `${logCaption} start compile react-client after generation - npm install - DONE`);

    await cmd(`cd ${appDir} && CI=true npm run build`,
      `${logCaption} start compile react-client after generation - npm run build, path: ${fs.realpathSync(appDir)}`,
      `${logCaption} start compile react-client after generation - npm run build - DONE\n-------------\n\n`);

    console.log(`${logCaption} react app generation test - PASSED`);
  }

  return {
    runGenerator: runGenerator,
    assertContent: assertContent,
    cmd: cmd,
    init: init,
    installAndBuild: installAndBuild
  };
};
