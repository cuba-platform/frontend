const {runCmdSync} = require('./common');

const dirNames = {
  rest: 'jmix-rest',
  'react-core': 'jmix-react-core',
  'react-ui': 'jmix-react-ui',
};

const updateClientLibs = async (clientDir, libs, updateCubaLibsOnly, packagesDir = '../packages') => {
  console.log('*** Updating client libs ***');

  for (const lib of libs) {
    console.log(`updating @haulmont/${lib}...`);
    const version = require(`${packagesDir}/${dirNames[lib]}/package.json`).version;
    cmd(clientDir, `npm install ${packagesDir}/${dirNames[lib]}/haulmont-${dirNames[lib]}-${version}.tgz`);
    console.log(`@haulmont/${lib} updated`);
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
