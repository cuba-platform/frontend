const {promisify} = require('util');
const path = require('path');
const rimraf = promisify(require('rimraf'));
const fs = require('fs');
const {runGenerator, cmd, assertContent, init, checkFormat} = require('./e2e-common')('sdk', 'scr');

const appDir = 'test/e2e/generated/sdk';
const fixturesDir = 'test/e2e/fixtures/sdk';

describe('test:e2e:sdk', () => {

  before(() => init());

  it('should generate sdk app', async function () {

    await rimraf(`${appDir}/*`);
    await runGenerator('all', appDir);

    console.log('e2e:sdk: start files comparison with expect gauges');
    assertContent('enums/enums.ts', appDir);
    assertContent('entities/scr$Car.ts', appDir);
    assertContent('entities/scr$SparePart.ts', appDir);
    assertContent('services.ts', appDir);
    assertContent('queries.ts', appDir);

    await checkFormat(appDir);

    console.log('\ne2e:sdk: prepare to compile sdk');
    fs.copyFileSync(path.join(fixturesDir, 'tsconfig.json'), path.join(appDir, 'tsconfig.json'));

    await cmd(`cd ${appDir} && npm init -y && npm install typescript @haulmont/jmix-rest`,
      `e2e:sdk: prepare to compile sdk - install packages, path: ${fs.realpathSync(appDir)}`,
      `e2e:sdk: compile packages - DONE`);

    await cmd(`cd ${appDir} && ./node_modules/.bin/tsc`,
      `e2e:sdk: start compile sdk, path: ${fs.realpathSync(appDir)}`,
      `e2e:sdk: compile sdk - DONE`);

    console.log('e2e:sdk: sdk generation test - PASSED');

  });
});
