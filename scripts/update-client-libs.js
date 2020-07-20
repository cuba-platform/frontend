const {runCmdSync} = require('./common');

const dirNames = {
  rest: 'cuba-rest-js',
  'react-core': 'cuba-react-core',
  'react-ui': 'cuba-react-ui',
};

const updateClientLibs = async (clientDir, libs, updateCubaLibsOnly, packagesDir = '../packages') => {
  console.log('*** Updating client libs ***');

  for (const lib of libs) {
    console.log(`updating @cuba-platform/${lib}...`);
    const version = require(`${packagesDir}/${dirNames[lib]}/package.json`).version;
    cmd(clientDir, `npm install ${packagesDir}/${dirNames[lib]}/cuba-platform-${lib}-${version}.tgz`);
    console.log(`@cuba-platform/${lib} updated`);
  }

  if (!updateCubaLibsOnly) {
    console.log(`updating other dependencies...`);
    cmd(clientDir, `npm install`);
  }

  console.log(`all dependencies updated`);
};

const cmd = (cwd, command) => {
  console.log(`${cwd}$ ${command}`);
  runCmdSync(command, cwd);
};

module.exports = updateClientLibs;
