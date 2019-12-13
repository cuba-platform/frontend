const path = require('path');
const fs = require('fs');
const {promisify} = require('util');
const exec = promisify(require('child_process').exec);
const rimraf = promisify(require('rimraf'));

// todo move model and answers to <root>/fixtures, or may be get model from backend app
const pathToModel = path.join(process.cwd(), 'test/e2e/fixtures', 'projectModel-scr.json');
const answers = require('./fixtures/react-client/answers.json');

const SCR_APP_DIR = path.join(process.cwd(), '../../react-client-scr');

const encodeAnswers = (answers) => {
  return Buffer.from(JSON.stringify(answers)).toString('base64')
};

const genClientScr = async () => {
  console.log('start generating react client scr into', SCR_APP_DIR);

  !fs.existsSync(SCR_APP_DIR) && fs.mkdirSync(SCR_APP_DIR);
  await rimraf(`${SCR_APP_DIR}/*`);

  await exec('' +
    `cd ${SCR_APP_DIR} && node ../packages/front-generator/bin/gen-cuba-front react-typescript:app` +
    ` --model ${pathToModel}`);

  await exec('' +
    `cd ${SCR_APP_DIR} && node ../packages/front-generator/bin/gen-cuba-front react-typescript:entity-cards` +
    ` --model ${pathToModel} --dirShift ../../ --dest ${SCR_APP_DIR}/src/app/entity-cards` +
    ` --answers ${encodeAnswers(answers.entityCards)}`);

  await exec('' +
    `cd ${SCR_APP_DIR} && node ../packages/front-generator/bin/gen-cuba-front react-typescript:entity-management` +
    ` --model ${pathToModel} --dirShift ../../ --dest ${SCR_APP_DIR}/src/app/entity-management` +
    ` --answers ${encodeAnswers(answers.entityManagement)}`);

  await exec('' +
    `cd ${SCR_APP_DIR} && node ../packages/front-generator/bin/gen-cuba-front react-typescript:entity-management` +
    ` --model ${pathToModel} --dirShift ../../ --dest ${SCR_APP_DIR}/src/app/entity-management2` +
    ` --answers ${encodeAnswers(answers.entityManagement2)}`);

  await exec('' +
    `cd ${SCR_APP_DIR} && node ../packages/front-generator/bin/gen-cuba-front react-typescript:entity-management` +
    ` --model ${pathToModel} --dirShift ../../ --dest ${SCR_APP_DIR}/src/app/entity-management3` +
    ` --answers ${encodeAnswers(answers.entityManagement3)}`);
  
  console.log('react client scr generation - DONE')
};

// noinspection JSIgnoredPromiseFromCall
genClientScr();
