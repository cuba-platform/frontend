const {promisify} = require('util');
const path = require('path');
const rimraf = promisify(require('rimraf'));
const exec = promisify(require('child_process').exec);
const answers = require('./answers');

(async function () {
  await rimraf('.tmp/*');
  try {
    await runGenerator('polymer2:app', '.tmp/polymer2-app');
    await runGenerator('polymer2:blank-component', '.tmp/polymer2-app/src/component', answers.blankComponent, '../');
    await runGenerator('polymer2:entity-management', '.tmp/polymer2-app/src/entity-management', answers.entityManagement, '../');
    await runGenerator('polymer2:entity-cards', '.tmp/polymer2-app/src/entity-cards', answers.entityCards, '../');
    await runGenerator('polymer2:entity-list', '.tmp/polymer2-app/src/entity-list', answers.entityList, '../');
    await runGenerator('polymer2:entity-edit', '.tmp/polymer2-app/src/entity-edit', answers.entityEdit, '../');
    await runGenerator('polymer2:query-results', '.tmp/polymer2-app/src/query-results', answers.queryResults, '../');
    await runGenerator('polymer2:service-form', '.tmp/polymer2-app/src/service-form', answers.serviceForm);
    await runGenerator('polymer2:service-data', '.tmp/polymer2-app/src/service-data', answers.serviceData, '../');
  } catch (e) {
    console.log(e);
    process.exit(1);
  }
})();

function runGenerator(name, dest, answers, dirShift) {
  const pathToModel = path.join(process.cwd(), 'test', 'projectModel.json');
  let command = `node bin/gen-cuba-front ${name} --model ${pathToModel}`;
  if (dest) {
    command += ` --dest ${dest}`;
  }
  if (answers) {
    command += ` --answers '${answers}'`;
  }
  if (dirShift) {
    command += ` --dirShift '${dirShift}'`
  }
  console.log(command);
  return exec(command);
}