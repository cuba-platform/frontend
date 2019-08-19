const {promisify} = require('util');
const path = require('path');
const rimraf = promisify(require('rimraf'));
const fs = require('fs');
const assert = require('assert');
const {runGenerator} = require('./../e2e-common');
const exec = promisify(require('child_process').exec);

(async function () {

  await rimraf('test/e2e/generated/*');
  const expectDir = 'test/e2e/expect';
  const reactAppDir = 'test/e2e/generated/react-client';

  runGenerator('react-typescript:app', reactAppDir, undefined, undefined, 'projectModel2.json')
    .then(() => {
      const enumsFile = fs.readFileSync(path.join(reactAppDir, 'src/cuba/enums/enums.ts'), 'utf8');
      const enumsExpectedFile = fs.readFileSync(expectDir + '/enums/enums.ts', 'utf8');
      let filesCompareRes = enumsFile.localeCompare(enumsExpectedFile);

      console.log('e2e:react-client: compare generated enums.ts file with expected result located at ' +
        expectDir + '/enums/enums.ts, result is', filesCompareRes, filesCompareRes === 0 ? 'OK' : 'FAIL');
      assert(filesCompareRes === 0);

      const carEntityFile = fs.readFileSync(path.join(reactAppDir, 'src/cuba/entities/mpg$Car.ts'), 'utf8');
      const expected = fs.readFileSync(expectDir + '/entities/mpg$Car.ts', 'utf8');
      filesCompareRes = expected.localeCompare(carEntityFile);

      console.log('e2e:react-client: compare generated mpg$Car.ts file with expected result located at ' +
        expectDir + '/entities/mpg$Car.ts, result is', filesCompareRes, filesCompareRes === 0 ? 'OK' : 'FAIL');
      assert(filesCompareRes === 0);

      //todo test when entity contains itself as member

    })
    .then(() => {
      console.log('\ne2e:react-client: start compile react-client after generation - npm install');
      return exec(`cd ${reactAppDir} && npm install`)
    })
    .then((onful, onreject) => {
      if (onful && onful.stdout) console.log(onful.stdout);
      if (onful && onful.stderr) console.log(onful.stderr);
      if (onreject && onreject.stdout) console.log(onreject.stdout);
      if (onreject && onreject.stderr) console.log(onreject.stderr);
    })
    .then(() => {
      console.log('\ne2e:react-client: start compile react-client after generation - npm run build');
      return exec(`npm run build`)
    })
    .then((onful, onreject) => {
      if (onful && onful.stdout) console.log(onful.stdout);
      if (onful && onful.stderr) console.log(onful.stderr);
      if (onreject && onreject.stdout) console.log(onreject.stdout);
      if (onreject && onreject.stderr) console.log(onreject.stderr);

      console.log('e2e:react-client: test complete, status OK');
    }).catch((e) => {
    console.log(e);
    process.exit(1);
  });

})();