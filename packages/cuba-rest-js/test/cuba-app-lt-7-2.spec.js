"use strict";

const assert = require('assert');
const cuba = require('../dist-node/cuba.js');
global.fetch = require('node-fetch');

const apiUrl = 'http://localhost:8080/app/rest/';

describe('CubaApp version <7.2.0', function () {

  let app;
  const initApiVersion = '5.5.5';

  before(function () {
    app = new cuba.CubaApp('', apiUrl, undefined, undefined, undefined, undefined, initApiVersion);
    return app.login('admin', 'admin');
  });

  describe('.setSessionLocal()', function() {
    it('should fail if version doesn\'t match', function(done) {
      app.setSessionLocale()
        .then(() => {
          done('did not fail');
        })
        .catch(reason => {
          assert(reason === cuba.CubaApp.NOT_SUPPORTED_BY_API_VERSION);
          done();
        });
    });
  });

});
