const {runCmdSync} = require('./common');

const packClientLibs = (prepublishLibs, packLibs) => {
    const prepublishScope = prepublishLibs.join(',');
    const packScope = packLibs.join(',');

    let prepublishCmd = `lerna run prepublishOnly --scope '{${prepublishScope}}'`;
    let execCmd = `lerna exec --scope '{${packScope}}' 'npm pack -q'`;

    runCmdSync(`${prepublishCmd} && ${execCmd}`);
};

module.exports = packClientLibs;
