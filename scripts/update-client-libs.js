const {promisify} = require('util');
const exec = promisify(require('child_process').exec);

const restVer = require('../packages/cuba-rest-js/package.json').version;
const reactVer = require('../packages/cuba-react/package.json').version;

const updateClientLibs = async () => {
  const cubaRestDir = 'cuba-rest-js';
  const cubaReactDir = 'cuba-react';

  await cmd(`npm install`);
  await cmd(`npm install ../packages/${cubaRestDir}/cuba-platform-rest-${restVer}.tgz`);
  await cmd(`npm install ../packages/${cubaReactDir}/cuba-platform-react-${reactVer}.tgz`);
};

const cmd = async (command) => {
  const dir = 'react-client-scr';
  console.log(`${dir}$ ${command}`);
  await exec(command, {cwd: dir});
};

// noinspection JSIgnoredPromiseFromCall
updateClientLibs();
