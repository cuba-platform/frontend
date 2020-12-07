"use strict";

const assert = require('assert');
const cuba = require('../dist-node/cuba.js');
global.fetch = require('node-fetch');

const apiUrl = 'http://localhost:8080/app/rest/';


describe('cuba', function () {

  describe('.initializeApp()', function () {
    it('simple initialization', function () {
      const app = cuba.initializeApp();
      assert.strictEqual(typeof app, 'object');
      cuba.removeApp();
    });
    it('initialization with the same name fails', function (done) {
      try {
        cuba.initializeApp();
        cuba.initializeApp();
        done('initialized twice');
      } catch (e) {
        done()
      }
      cuba.removeApp();
    });
    it('initialization with same explicit name fails', function(done) {
      assert.throws(function() {
        cuba.initializeApp({name: 'app2'});
        cuba.initializeApp({name: 'app2'});
        done('initialized twice');
      }, Error);
      done();
    });
    it('initialization with explicit parameters', function(done) {
      const app = cuba.initializeApp({
        apiUrl: apiUrl,
        name: 'AppCreatedWithExplicitParams',
        restClientId: 'client',
        restClientSecret: 'secret',
        defaultLocale: 'en',
        storage: {
          clear: () => {
            done();
          }
        }
      });
      assert.strictEqual(typeof app, 'object');
      cuba.removeApp('AppCreatedWithExplicitParams');
    })
  });

  describe('.getApp()', function () {
    it('initialize and retrieve - default config', function () {
      let app = cuba.initializeApp();
      assert.strictEqual(app, cuba.getApp());
      cuba.removeApp();
    });
  });

  describe('.removeApp()', function() {
    it('throws when trying to get non-existent app', function (done) {
      assert.throws(function() {
        cuba.removeApp('Non-existent app name');
      }, Error);
      done();
    });
  });

  describe('.getBasicAuthHeaders()', function() {
    it('uses default locale if not passed explicitly', function() {
      const headers = cuba.getBasicAuthHeaders('client', 'secret');
      assert.equal(headers['Accept-Language'], 'en');
    });
  });
});
