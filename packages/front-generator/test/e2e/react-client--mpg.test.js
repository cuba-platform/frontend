const path = require('path');
const {promisify} = require('util');
const rimraf = promisify(require('rimraf'));
const {runGenerator, assertContent, init, installAndBuild} = require('./e2e-common')('react-typescript', 'mpg');
const answers = require('./fixtures/react-client/answers.json');

const MPG_APP_DIR = 'test/e2e/generated/react-client-mpg';

describe('test:e2e:react:mpg', () => {

  before(() => init());

  it('should generate react app - mpg', async function () {

    await rimraf(`${MPG_APP_DIR}/*`);
    await runGenerator('app', MPG_APP_DIR);

    console.log('e2e:react: start files comparison with expect gauges');

    const srcCubaDir = path.join(MPG_APP_DIR, 'src/cuba');
    assertContent('enums/enums.ts', srcCubaDir);
    assertContent('entities/mpg$Car.ts', srcCubaDir);
    assertContent('entities/mpg$SparePart.ts', srcCubaDir);
    assertContent('entities/MpgUserInfo.ts', srcCubaDir);
    assertContent('services.ts', srcCubaDir);
    assertContent('queries.ts', srcCubaDir);

    await runGenerator('entity-cards', `${MPG_APP_DIR}/src/app/entity-cards`,
      JSON.stringify(answers.entityCards), '../../');

    //entity management with "listType": "cards"
    await runGenerator('entity-management', `${MPG_APP_DIR}/src/app/entity-management`,
      JSON.stringify(answers.entityManagement), '../../');

    //entity management with "listType": "list"
    await runGenerator('entity-management', `${MPG_APP_DIR}/src/app/entity-management2`,
      JSON.stringify(answers.entityManagement2), '../../');

    //entity management with "listType": "table"
    await runGenerator('entity-management', `${MPG_APP_DIR}/src/app/entity-management3`,
      JSON.stringify(answers.entityManagement3), '../../');

    await installAndBuild('mpg-model', MPG_APP_DIR);
  });

});
