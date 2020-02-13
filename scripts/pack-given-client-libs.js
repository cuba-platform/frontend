const packClientLibs = require('./pack-client-libs');

const libs = process.argv.slice(2);

packClientLibs(libs, libs);
