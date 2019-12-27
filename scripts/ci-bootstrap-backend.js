const {promisify} = require('util');
const exec = promisify(require('child_process').exec);

const ciBootstrapBackend = async () => {
  await exec(`psql -c "create user cuba with encrypted password 'cuba';" -U postgres`);
  await exec(`psql -c "alter user cuba createdb;" -U postgres`);
  await exec(`sample-car-rent/gradlew -v`);
  await exec(`sample-car-rent/gradlew -p sample-car-rent setupTomcat createDb --no-daemon`);
  await exec(`sample-car-rent/gradlew -p sample-car-rent assemble deploy start waitAppStarted --no-daemon`);
};

// noinspection JSIgnoredPromiseFromCall
ciBootstrapBackend();
