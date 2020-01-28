const execSync = require('child_process').execSync;

exports.runCmdSync = (command) => {
    try {
        execSync(command, {stdio: 'inherit'});
    } catch (err) {
        const errorCode = Number.isFinite(parseInt(err.status)) ? parseInt(err.status) : 1;
        process.exit(errorCode);
    }
};
