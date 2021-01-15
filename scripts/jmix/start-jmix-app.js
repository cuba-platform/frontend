const {runCmdSync, isWindows} = require("../common");

function startJmixApp() {
  let gradlew = 'gradlew';
  if (isWindows()){
    gradlew = 'gradlew.bat';
  }

  runCmdSync(`scr-jmix/${gradlew} -p scr-jmix bootRun`);
}

startJmixApp();