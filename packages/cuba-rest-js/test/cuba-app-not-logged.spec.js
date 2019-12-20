"use strict";

const cuba = require('../dist-node/cuba.js');
global.fetch = require('node-fetch');

const apiUrl = 'http://localhost:8080/app/rest/';

describe('CubaApp not logged in', function() {
  describe('.setSessionLocal()', function() {
    it('should fail if not logged in', function(done) {
      const app = new cuba.CubaApp('', apiUrl);
      app.setSessionLocale()
        .then(() => {
          done('did not fail');
        })
        .catch(() => {
          done();
        })
    });
  });
});
