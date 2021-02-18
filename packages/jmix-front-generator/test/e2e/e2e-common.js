const path = require('path');
const assert = require('assert');
const {promisify} = require('util');
const exec = promisify(require('child_process').exec);
const fs = require('fs');
const prettier = require('prettier');
const updateClientLibs = require('../../../../scripts/update-client-libs')

const EXPECT_DIR = path.join('test', 'e2e', 'expect');
const GENERATED_DIR = path.join('test', 'e2e', 'generated');
const LOG_DIR = path.join(GENERATED_DIR, 'logs');

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
  function runGenerator(moduleName, dest, answersJSONString, dirShift, modelFile = 'projectModel-scr.json') {
    const pathToModel = path.join(process.cwd(), 'test/e2e/fixtures', modelFile);

    let command = `node bin/gen-jmix-front ${generatorName}:${moduleName} --model ${pathToModel}`;
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

  function assertContent(filePath, moduleDir) {
    const expectFilePath = path.join(EXPECT_DIR, filePath);
    const actualFilePath = path.join(moduleDir, filePath);

    const expected =
      prettier.format(fs.readFileSync(expectFilePath, 'utf8'), {parser: "typescript"})
        .replace(/\r\n/g, '\n'); //normalise cross platform 'end of line'

    assert.strictEqual(fs.readFileSync(actualFilePath, 'utf8'), expected);
    logInfo(`e2e: assert file ${actualFilePath} with expect gauge ${expectFilePath} - PASSED`);
  }

  async function installAndBuild(suffix, appDir) {
    const logCaption = `e2e:react-client:${suffix}:`;
    console.log(`${logCaption} generation complete, start compilation`);

    // Do not use the libs from npm as it may lead to compatibility issues.
    await updateClientLibs(appDir, ['rest', 'react-core', 'react-ui'], false, path.join(process.cwd(), '..'));

    const buildCommand = addEnvVars('npm run build');
    await cmd(`cd ${appDir} && ${buildCommand}`,
      `${logCaption} start compile react-client after generation - '${buildCommand}', path: ${fs.realpathSync(appDir)}`,
      `${logCaption} compile react-client after generation - DONE`);

    console.log(`${logCaption} compilation - PASSED`);
  }

  async function checkFormat(appDir) {

    const prettierPath = path.join('node_modules', '.bin', 'prettier');
    const prettierPattern = path.join(appDir, '**', '*.ts');

    await cmd(`${prettierPath} --check "${prettierPattern}"`,
      `${generatorName}:${logFileSuffix}: start check formatting using prettier, pattern: ${prettierPattern}`,
      `${generatorName}:${logFileSuffix}: check formatting - DONE`);
  }

  //todo make cross-platform
  function addEnvVars(cmd) { //CI env var not needed on win
    return (process.platform === 'linux' ? 'CI=true ' : '') + cmd;
  }

  return {
    runGenerator: runGenerator,
    assertContent: assertContent,
    cmd: cmd,
    init: init,
    installAndBuild: installAndBuild,
    checkFormat: checkFormat,
  };
};
