const {runCmdSync} = require('./common');

const ciBootstrapBackend = () => {
  runCmdSync(`psql -c "create user cuba with encrypted password 'cuba';" -U postgres`);
  runCmdSync(`psql -c "alter user cuba createdb;" -U postgres`);
  runCmdSync(`sample-car-rent/gradlew -v`);
  runCmdSync(`sample-car-rent/gradlew -p sample-car-rent setupTomcat createDb --no-daemon`);
  runCmdSync(`sample-car-rent/gradlew -p sample-car-rent assemble deploy start waitAppStarted --no-daemon`);
};

ciBootstrapBackend();
