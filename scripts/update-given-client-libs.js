const updateClientLibs = require('./update-client-libs');

const args = process.argv.slice(2);
const clientDir = args[0];
const libs = args.slice(1);

updateClientLibs(clientDir, libs, true);
