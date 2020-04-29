const {runCmdSync} = require('./common');

const ciBootstrapBackend = () => {

  const backendAppDir = process.argv.length > 2 ? process.argv[2] : `sample-car-rent`;

  runCmdSync(`psql -c "create user cuba with encrypted password 'cuba';" -U postgres`);
  runCmdSync(`psql -c "alter user cuba createdb;" -U postgres`);
  runCmdSync(`${backendAppDir}/gradlew -v`);
  runCmdSync(`${backendAppDir}/gradlew -p ${backendAppDir} setupTomcat createDb --no-daemon`);
  runCmdSync(`${backendAppDir}/gradlew -p ${backendAppDir} assemble deploy start waitAppStarted --no-daemon`);
};

ciBootstrapBackend();
