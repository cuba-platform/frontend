const {runCmdSync, log} = require("../common");
const fse = require('fs-extra');

function updateJmixApp() {
  if (!fse.existsSync('scr-jmix') && isEmptyDir('scr-jmix')) {
    log.error('repo not found');
    return;
  }
  runCmdSync('git -C scr-jmix pull');
  log.success('done');
}

updateJmixApp();