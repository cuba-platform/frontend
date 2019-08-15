const {promisify} = require('util');
const path = require('path');
const rimraf = promisify(require('rimraf'));
const exec = promisify(require('child_process').exec);
const fs = require('fs');
const assert = require('assert');
const {runGenerator} = require('./../e2e-common');

(async function () {
  await rimraf('.tmp/*');

  const generationProcesses = [];

  await exec('node bin/gen-cuba-front list -s ./.tmp/generators.json');

  const sdkAppDir = '.tmp/sdk';
  generationProcesses.push(runGenerator('sdk:all', sdkAppDir));

  Promise.all(generationProcesses)
    .then(() => {
      const enumsFile = fs.readFileSync(path.join(sdkAppDir, 'enums/enums.ts'), 'utf8');
      const enumsExpectedFile = fs.readFileSync('test/e2e/results/enums/enums.ts', 'utf8');
      let enumFilesCompareRes = enumsFile.localeCompare(enumsExpectedFile);
      console.log('e2e:sdk: compare generated enums.ts file with expected result located at ' +
        'test/e2e/results/enums/enums.ts, result is', enumFilesCompareRes, enumFilesCompareRes === 0 ? 'OK' : 'FAIL');
      assert(enumFilesCompareRes === 0);
    })
    .catch((e) => {
      console.log(e);
      process.exit(1);
    });

})();

