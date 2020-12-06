const {promisify} = require('util');
const rimraf = promisify(require('rimraf'));
const {runGenerator, init} = require('./e2e-common')('polymer2-ts');
const answers = require('./fixtures/polymer-client/answers');

const appDir = 'test/e2e/generated/polymer2-ts-app';

describe('test:e2e:polymer2-ts', () => {
  it('should generate polymer 2 typescript app', function () {

    init();

    const generationProcesses = [];
    generationProcesses.push(runGenerator('polymer2-typescript:app', appDir));

    generationProcesses.push(runGenerator('polymer2-typescript:blank-component', `${appDir}/src/component`,
      JSON.stringify(answers.blankComponent), '../'));

    generationProcesses.push(runGenerator('polymer2-typescript:entity-cards', `${appDir}/src/entity-cards`,
      JSON.stringify(answers.entityCards), '../'));

    generationProcesses.push(runGenerator('polymer2-typescript:entity-list', `${appDir}/src/entity-list`,
      JSON.stringify(answers.entityList), '../'));

    generationProcesses.push(runGenerator('polymer2-typescript:entity-edit', `${appDir}/src/entity-edit`,
      JSON.stringify(answers.entityEdit), '../'));

    generationProcesses.push(runGenerator('polymer2-typescript:entity-management', `${appDir}/src/entity-management`,
      JSON.stringify(answers.entityManagement), '../'));

    return rimraf(`${appDir}/*`)
      .then(() => Promise.all(generationProcesses))
      .then(() => console.log('e2e:polymer2-ts: polymer2-ts-app generation test - PASSED'))
  })
});