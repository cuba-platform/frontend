const {promisify} = require('util');
const exec = promisify(require('child_process').exec);

const dirNames = {
  rest: 'cuba-rest-js',
  'react-core': 'cuba-react-core',
  'react-ui': 'cuba-react-ui',
};

const updateClientLibs = async (clientDir, libs) => {
  console.log('*** Updating client libs ***');

  for (const lib of libs) {
    console.log(`updating @cuba-platform/${lib}...`);
    const version = require(`../packages/${dirNames[lib]}/package.json`).version;
    await cmd(clientDir, `npm install ../packages/${dirNames[lib]}/cuba-platform-${lib}-${version}.tgz`);
    console.log(`@cuba-platform/${lib} updated`);
  }

  console.log(`updating other dependencies...`);
  await cmd(clientDir, `npm install`);
  console.log(`all dependencies updated`);
};

const cmd = async (cwd, command) => {
  console.log(`${cwd}$ ${command}`);
  await exec(command, {cwd: cwd});
};

module.exports = updateClientLibs;
