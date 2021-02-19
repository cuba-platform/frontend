const path = require('path');
const {promisify} = require('util');
const rimraf = promisify(require('rimraf'));
const {installAndBuild, runGenerator, init, checkFormat} = require('./e2e-common')('react-typescript', 'new-project');
const fs = require('fs');
const assert = require('assert');

const NEW_PRJ_APP_DIR = 'test/e2e/generated/react-client-new-project';

describe('test:e2e:react:new-project', () => {

  before(() => init());

  it('should generate react app from newborn cuba project', async function () {

    await rimraf(`${NEW_PRJ_APP_DIR}/*`);
    await runGenerator('app', NEW_PRJ_APP_DIR,
      undefined, undefined, 'projectModel-new.json');

    const srcCubaDir = path.join(NEW_PRJ_APP_DIR, 'src/jmix');
    assert.ok(!fs.existsSync(`${srcCubaDir}/enums/enums.ts`));

    await checkFormat(NEW_PRJ_APP_DIR);
    await installAndBuild('new-project-model', NEW_PRJ_APP_DIR);
  });

});
