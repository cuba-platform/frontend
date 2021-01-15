const {runCmdSync} = require('./common');

const packClientLibs = (prepublishLibs, packLibs) => {

  const prepublishScope = composeScope(prepublishLibs);
  const packScope = composeScope(packLibs);

  const prepublishCmd = prepublishScope && `lerna run prepublishOnly ${prepublishScope}`;
  const packCmd = packScope && `lerna exec ${packScope} "npm pack -q"`;

  let cmd = prepublishCmd ? prepublishCmd : '';
  if (cmd.length > 0 && packCmd) cmd += ' && ';
  cmd = packCmd ? cmd + packCmd : cmd;

  console.log(`${cmd}`);
  runCmdSync(`${cmd}`);
};

const composeScope = (libs) => {
  if (!libs || libs.length === 0) return null;

  return libs.length > 1
    ? `--scope '{${libs.join(',')}}'`
    : `--scope '${libs[0]}'`; //curly brackets not work for array with single element
};

module.exports = packClientLibs;
