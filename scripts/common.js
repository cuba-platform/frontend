const execSync = require('child_process').execSync;

exports.runCmdSync = (command, cwd = process.cwd()) => {
    try {
        execSync(command, {stdio: 'inherit', cwd: cwd});
    } catch (err) {
        const errorCode = Number.isFinite(parseInt(err.status)) ? parseInt(err.status) : 1;
        process.exit(errorCode);
    }
};

const highlightInfo = '\x1b[34m%s\x1b[0m';
const highlightSuccess = '\x1b[32m%s\x1b[0m';
const highlightError = '\x1b[31m%s\x1b[0m';
exports.log = {
  info: (message) => console.log(highlightInfo, message),
  success: (message) => console.log(highlightSuccess, message),
  error: (message) => console.log(highlightError, message),
};