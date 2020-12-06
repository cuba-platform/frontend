const cuba = require('../dist-node/cuba.js');
const apiUrl = 'http://localhost:8080/rest/';

exports.initApp = function initApp(initApiVersion) {
  return new cuba.CubaApp('', apiUrl, 'client', 'secret', undefined, undefined, initApiVersion);
};
