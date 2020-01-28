const execSync = require('child_process').execSync;

exports.runCmdSync = (command, cwd = process.cwd()) => {
    try {
        execSync(command, {stdio: 'inherit', cwd: cwd});
    } catch (err) {
        const errorCode = Number.isFinite(parseInt(err.status)) ? parseInt(err.status) : 1;
        process.exit(errorCode);
    }
};
