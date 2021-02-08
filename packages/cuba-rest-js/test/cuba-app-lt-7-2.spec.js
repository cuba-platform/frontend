"use strict";

const assert = require('assert');
const cuba = require('../dist-node/cuba.js');
global.fetch = require('node-fetch');
const {initApp} = require('./common');

describe('CubaApp version <7.2.0', () => {

  let app;
  const initApiVersion = '5.5.5';

  beforeAll(() => {
    app = initApp(initApiVersion);
    return app.login('admin', 'admin');
  });

  describe('.setSessionLocal()', () => {
    it('should fail if version doesn\'t match', done => {
      app.setSessionLocale()
        .then(() => {
          done('did not fail');
        })
        .catch(error => {
          assert(error.message === cuba.CubaApp.NOT_SUPPORTED_BY_API_VERSION);
          done();
        });
    });
  });

});
