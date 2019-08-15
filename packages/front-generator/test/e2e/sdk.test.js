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
      let filesCompareRes = enumsFile.localeCompare(enumsExpectedFile);
      console.log('e2e:sdk: compare generated enums.ts file with expected result located at ' +
        'test/e2e/results/enums/enums.ts, result is', filesCompareRes, filesCompareRes === 0 ? 'OK' : 'FAIL');
      assert(filesCompareRes === 0);

      const carEntityFile = fs.readFileSync(path.join(sdkAppDir, 'entities/mpg$Car.ts'), 'utf8');
      const expected = fs.readFileSync('test/e2e/results/entities/mpg$Car.ts', 'utf8');
      filesCompareRes = expected.localeCompare(carEntityFile);
      console.log('e2e:sdk: compare generated mpg$Car.ts file with expected result located at ' +
        'test/e2e/results/entities/mpg$Car.ts, result is', filesCompareRes, filesCompareRes === 0 ? 'OK' : 'FAIL');
      assert(filesCompareRes === 0);

      //todo test when entity contains itself as member

      //todo compile sdk after gen

    })
    .catch((e) => {
      console.log(e);
      process.exit(1);
    });

})();

