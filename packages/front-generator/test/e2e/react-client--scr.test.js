const path = require('path');
const {promisify} = require('util');
const rimraf = promisify(require('rimraf'));

const {
  runGenerator, assertContent, init, installAndBuild, checkFormat, runTests
} = require('./e2e-common')('react-typescript', 'scr');

const answers = require('./fixtures/react-client/answers.json');
const SCR_APP_DIR = 'test/e2e/generated/react-client-scr';

describe('test:e2e:react:scr', () => {

  before(() => init());

  it('should generate react app - scr', async function () {

    await rimraf(`${SCR_APP_DIR}/*`);
    await runGenerator('app', SCR_APP_DIR);

    console.log('e2e:react: start files comparison with expect gauges');

    const srcCubaDir = path.join(SCR_APP_DIR, 'src/cuba');
    assertContent('enums/enums.ts', srcCubaDir);
    assertContent('entities/scr$Car.ts', srcCubaDir);
    assertContent('entities/scr$SparePart.ts', srcCubaDir);
    assertContent('entities/ScrUserInfo.ts', srcCubaDir);
    assertContent('services.ts', srcCubaDir);
    assertContent('queries.ts', srcCubaDir);

    await runGenerator('entity-cards', `${SCR_APP_DIR}/src/app/entity-cards`,
      JSON.stringify(answers.entityCards), '../../');

    //entity management with "listType": "cards"
    await runGenerator('entity-management', `${SCR_APP_DIR}/src/app/entity-management`,
      JSON.stringify(answers.entityManagement), '../../');

    //entity management with "listType": "list"
    await runGenerator('entity-management', `${SCR_APP_DIR}/src/app/entity-management2`,
      JSON.stringify(answers.entityManagement2), '../../');

    //entity management with "listType": "table"
    await runGenerator('entity-management', `${SCR_APP_DIR}/src/app/entity-management3`,
      JSON.stringify(answers.entityManagement3), '../../');

    await checkFormat(SCR_APP_DIR);
    await installAndBuild('scr-model', SCR_APP_DIR);

    await runTests(SCR_APP_DIR);
  });

});
