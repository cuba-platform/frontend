const { runCmdSync, isWindows } = require("./common")
const path = require('path');

let [, , ...scriptArg] = process.argv;
scriptArg = scriptArg.join(" ");

const basePath = process.cwd();
const scriptName = isWindows() ? 'gradlew.bat' : 'gradlew';
const pathToScript = path.join(basePath, 'sample-car-rent', scriptName);

const cmd = `${pathToScript} ${scriptArg}`;
runCmdSync(`${cmd}`);
