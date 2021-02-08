const {runCmdSync, isWindows} = require("../common");
const path = require("path");

function startJmixApp(runInBg = false) {
    let gradlew = 'gradlew';
    if (isWindows()){
        gradlew = 'gradlew.bat';
    }

    const basePath = process.cwd();
    const pathToGradlew = path.join(basePath, 'scr-jmix', gradlew);
    const arg = '-p scr-jmix bootRun'

    const cmd = `${pathToGradlew} ${arg}`

    if (runInBg && !isWindows()) {
        runCmdSync(`nohup ${cmd} >app.log 2>&1 &`)
        return;
    }

    runCmdSync(cmd);
}

module.exports = startJmixApp;