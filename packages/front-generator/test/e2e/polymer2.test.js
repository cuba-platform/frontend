const {promisify} = require('util');
const rimraf = promisify(require('rimraf'));
const {runGenerator, init} = require('./e2e-common')('polymer2');
const answers = require('./fixtures/answers');

const appDir = 'test/e2e/generated/polymer2-app';

describe('test:e2e:polymer2', () => {
  it('should generate polymer 2 app and modules', function () {

    init();

    const generationProcesses = [];
    generationProcesses.push(runGenerator('app', appDir));

    generationProcesses.push(runGenerator('blank-component', `${appDir}/src/component`,
      JSON.stringify(answers.blankComponent), '../'));

    generationProcesses.push(runGenerator('entity-management', `${appDir}/src/entity-management`,
      JSON.stringify(answers.entityManagement), '../'));

    generationProcesses.push(runGenerator('entity-cards', `${appDir}/src/entity-cards`,
      JSON.stringify(answers.entityCards), '../'));

    generationProcesses.push(runGenerator('entity-list', `${appDir}/src/entity-list`,
      JSON.stringify(answers.entityList), '../'));

    generationProcesses.push(runGenerator('entity-edit', `${appDir}/src/entity-edit`,
      JSON.stringify(answers.entityEdit), '../'));

    generationProcesses.push(runGenerator('query-results', `${appDir}/src/query-results`,
      JSON.stringify(answers.queryResults), '../'));

    generationProcesses.push(runGenerator('service-form', `${appDir}/src/service-form`,
      JSON.stringify(answers.serviceForm), '../'));

    generationProcesses.push(runGenerator('service-data', `${appDir}/src/service-data`,
      JSON.stringify(answers.serviceData), '../'));

    return rimraf(`${appDir}/*`)
      .then(() => Promise.all(generationProcesses))
      .then(() => console.log('e2e:polymer2: polymer2-app generation test - PASSED'))
  });
});