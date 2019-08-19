const {promisify} = require('util');
const path = require('path');
const rimraf = promisify(require('rimraf'));
const fs = require('fs');
const assert = require('assert');
const {runGenerator} = require('./../e2e-common');

(async function () {

  await rimraf('.tmp/*');
  const sdkAppDir = '.tmp/sdk';
  const expectDir = 'test/e2e/expect';

  runGenerator('sdk:all', sdkAppDir, undefined, undefined, 'projectModel2.json')
    .then(() => {
      const enumsFile = fs.readFileSync(path.join(sdkAppDir, 'enums/enums.ts'), 'utf8');
      const enumsExpectedFile = fs.readFileSync(expectDir + '/enums/enums.ts', 'utf8');
      let filesCompareRes = enumsFile.localeCompare(enumsExpectedFile);

      console.log('e2e:sdk: compare generated enums.ts file with expected result located at ' +
        expectDir + '/enums/enums.ts, result is', filesCompareRes, filesCompareRes === 0 ? 'OK' : 'FAIL');
      assert(filesCompareRes === 0);

      const carEntityFile = fs.readFileSync(path.join(sdkAppDir, 'entities/mpg$Car.ts'), 'utf8');
      const expected = fs.readFileSync(expectDir + '/entities/mpg$Car.ts', 'utf8');
      filesCompareRes = expected.localeCompare(carEntityFile);

      console.log('e2e:sdk: compare generated mpg$Car.ts file with expected result located at ' +
        expectDir + '/entities/mpg$Car.ts, result is', filesCompareRes, filesCompareRes === 0 ? 'OK' : 'FAIL');
      assert(filesCompareRes === 0);

      //todo test when entity contains itself as member

      // console.log('\ne2e:sdk: start compile sdk after generation');
      // const exec = promisify(require('child_process').exec);
      // fs.writeFileSync(path.join(sdkAppDir, 'tsconfig.json'), '{}');
      // exec(`cd ${sdkAppDir} && npx tsc`)
    })
    .catch((e) => {
      console.log(e);
      process.exit(1);
    });

})();

