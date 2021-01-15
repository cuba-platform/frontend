const {runCmdSync, isEmptyDir, log} = require("../common");
const fse = require('fs-extra');

function bootstrapJmixApp() {
  log.info('bootstrapping Jmix app');
  checkoutJmixScrRepo();
  createDb();
}

function checkoutJmixScrRepo() {
  if (fse.existsSync('scr-jmix') && !isEmptyDir('scr-jmix')) {
    log.info('repo already cloned, skipping');
    return;
  }
  runCmdSync('git clone https://github.com/jmix-projects/scr-jmix.git');
  log.info('repo has been cloned');
}

function createDb() {
  // TODO
}

bootstrapJmixApp();