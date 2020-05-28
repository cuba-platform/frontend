"use strict";

const {initApp} = require('./common');
global.fetch = require('node-fetch');

describe('CubaApp not logged in', function() {
  describe('.setSessionLocal()', function() {
    it('should fail if not logged in', function(done) {
      const app = initApp();
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
