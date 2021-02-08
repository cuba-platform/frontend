const startJmixApp = require("./jmix/_start-jmix-app");
const {runCmdSync} = require('./common');

const ciBootstrapBackend = () => {

  require("./jmix/bootstrap-jmix-app");

  runCmdSync(`psql -c "create user cuba with encrypted password 'cuba';" -U postgres`);
  runCmdSync(`psql -c "alter user cuba createdb;" -U postgres`);
  runCmdSync(`psql -c "create database "'"scr-jmix"'";" -U postgres`);
  runCmdSync(`psql -c "grant all privileges on database "'"scr-jmix"'" to cuba;" -U postgres`);

  startJmixApp(true)
};

ciBootstrapBackend();
