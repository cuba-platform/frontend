const cuba = require('../dist-node/cuba.js');
const apiUrl = 'http://localhost:8080/app/rest/';

exports.initApp = function initApp(initApiVersion) {
  return new cuba.CubaApp('', apiUrl, 'scr-886snZDO',
    'bf37f38be32f307c4fc5b2c1517cac2984ea46eaf6856dfa56cfe92212ee26c9',
    undefined, undefined, initApiVersion);
};
