const {promisify} = require('util');
const path = require('path');
const rimraf = promisify(require('rimraf'));
const exec = promisify(require('child_process').exec);
const answers = require('./answers');

(async function () {
  await rimraf('.tmp/*');

  const generationProcesses = [];

  const polymer2AppDir = '.tmp/polymer2-app';

  generationProcesses.push(runGenerator('polymer2:app', polymer2AppDir));
  generationProcesses.push(runGenerator('polymer2:blank-component', `${polymer2AppDir}/src/component`, answers.blankComponent, '../'));
  generationProcesses.push(runGenerator('polymer2:entity-management', `${polymer2AppDir}/src/entity-management`, answers.entityManagement, '../'));
  generationProcesses.push(runGenerator('polymer2:entity-cards', `${polymer2AppDir}/src/entity-cards`, answers.entityCards, '../'));
  generationProcesses.push(runGenerator('polymer2:entity-list', `${polymer2AppDir}/src/entity-list`, answers.entityList, '../'));
  generationProcesses.push(runGenerator('polymer2:entity-edit', `${polymer2AppDir}/src/entity-edit`, answers.entityEdit, '../'));
  generationProcesses.push(runGenerator('polymer2:query-results', `${polymer2AppDir}/src/query-results`, answers.queryResults, '../'));
  generationProcesses.push(runGenerator('polymer2:service-form', `${polymer2AppDir}/src/service-form`, answers.serviceForm, '../'));
  generationProcesses.push(runGenerator('polymer2:service-data', `${polymer2AppDir}/src/service-data`, answers.serviceData, '../'));

  const polymer2tsAppDir = '.tmp/polymer2-ts-app';

  generationProcesses.push(runGenerator('polymer2-typescript:app', polymer2tsAppDir));
  generationProcesses.push(runGenerator('polymer2-typescript:blank-component', `${polymer2tsAppDir}/src/component`, answers.blankComponent, '../'));
  generationProcesses.push(runGenerator('polymer2-typescript:entity-cards', `${polymer2tsAppDir}/src/entity-cards`, answers.entityCards, '../'));
  generationProcesses.push(runGenerator('polymer2-typescript:entity-list', `${polymer2tsAppDir}/src/entity-list`, answers.entityList, '../'));
  generationProcesses.push(runGenerator('polymer2-typescript:entity-edit', `${polymer2tsAppDir}/src/entity-edit`, answers.entityEdit, '../'));
  generationProcesses.push(runGenerator('polymer2-typescript:entity-management', `${polymer2tsAppDir}/src/entity-management`, answers.entityManagement, '../'));

  Promise.all(generationProcesses).catch((e) => {
    console.log(e);
    process.exit(1);
  });

})();

function runGenerator(name, dest, answersJSONString, dirShift) {
  const pathToModel = path.join(process.cwd(), 'test', 'projectModel.json');
  let command = `node bin/gen-cuba-front ${name} --model ${pathToModel}`;
  if (dest) {
    command += ` --dest ${dest}`;
  }
  if (answersJSONString) {
    command += ` --answers ${Buffer.from(answersJSONString).toString('base64')}`;
  }
  if (dirShift) {
    command += ` --dirShift ${dirShift}`
  }
  console.log(command);
  return exec(command);
}