const path = require('path');
const {promisify} = require('util');
const rimraf = promisify(require('rimraf'));
const {installAndBuild, runGenerator, init} = require('./e2e-common')('react-typescript', 'trusty-dragon');
const fs = require('fs');
const assert = require('assert');

const PRISTINE_APP_DIR = 'test/e2e/generated/react-client-pristine';

describe('test:e2e:react:trusty-dragon', () => {

  before(() => init());

  it('should generate react app from newborn cuba project - trusty-dragon', async function () {

    await rimraf(`${PRISTINE_APP_DIR}/*`);
    await runGenerator('app', PRISTINE_APP_DIR,
      undefined, undefined, 'projectModel-pristine.json');

    const srcCubaDir = path.join(PRISTINE_APP_DIR, 'src/cuba');
    assert.ok(!fs.existsSync(`${srcCubaDir}/enums/enums.ts`));

    await installAndBuild('pristine-model', PRISTINE_APP_DIR);
  });

});
