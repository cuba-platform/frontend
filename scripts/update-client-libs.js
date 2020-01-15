const {promisify} = require('util');
const exec = promisify(require('child_process').exec);

const restVer = require('../packages/cuba-rest-js/package.json').version;
const reactCoreVer = require('../packages/cuba-react-core/package.json').version;
const reactUiVer = require('../packages/cuba-react-ui/package.json').version;

const updateClientLibs = async () => {
  const cubaRestDir = 'cuba-rest-js';
  const cubaReactCoreDir = 'cuba-react-core';
  const cubaReactUiDir = 'cuba-react-ui';

  await cmd(`npm install ../packages/${cubaRestDir}/cuba-platform-rest-${restVer}.tgz`);
  await cmd(`npm install ../packages/${cubaReactCoreDir}/cuba-platform-react-core-${reactCoreVer}.tgz`);
  await cmd(`npm install ../packages/${cubaReactUiDir}/cuba-platform-react-ui-${reactUiVer}.tgz`);
  await cmd(`npm install`);
};

const cmd = async (command) => {
  const dir = 'react-client-scr';
  console.log(`${dir}$ ${command}`);
  await exec(command, {cwd: dir});
};

// noinspection JSIgnoredPromiseFromCall
updateClientLibs();
