const {runCmdSync, isEmptyDir, log} = require("../common");
const fs = require('fs');

function bootstrapJmixApp() {
  log.info('bootstrapping Jmix app');
  checkoutJmixScrRepo();
}

function checkoutJmixScrRepo() {
  if (fs.existsSync('scr-jmix') && !isEmptyDir('scr-jmix')) {
    log.info('repo already cloned, skipping');
    return;
  }
  runCmdSync('git clone https://github.com/jmix-projects/scr-jmix.git');
  log.info('repo has been cloned');
}

bootstrapJmixApp();