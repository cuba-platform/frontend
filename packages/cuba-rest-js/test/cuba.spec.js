"use strict";

const assert = require('assert');
const cuba = require('../dist-node/cuba.js');

global.fetch = new require('node-fetch');

const apiUrl = 'http://localhost:8080/app/rest/';


describe('cuba', function () {

  afterEach(function () {
    cuba.removeApp();
  });


  describe('.initializeApp()', function () {
    it('simple initialization', function () {
      const app = cuba.initializeApp();
      assert.equal(typeof app, 'object');
    });
    it('initialization with the same name fails', function (done) {
      try {
        cuba.initializeApp();
        cuba.initializeApp();
        done('initialized twice');
      } catch (e) {
        done()
      }
    });
  });

  describe('.getApp()', function () {
    it('initialize and retrieve - default config', function () {
      let app = cuba.initializeApp();
      assert.equal(app, cuba.getApp());
    });
  });

});

describe('CubaApp', function() {

  let app;

  before(function() {
    app = new cuba.CubaApp('', apiUrl);
  });

  describe('#login()', function () {
    it('shouldn\'t work with bad credentials', function (done) {
      app.login('admin', 'admin2')
        .then(() => {
          done('works with bad credentials');
        })
        .catch(() => {
          done()
        });
    });
    it('should work with right credentials', function () {
      return app.login('admin', 'admin');
    });
  });


  it('.loadMetadata()', function() {
    return app.loadMetadata();
  });

  it('.loadEnums()', function() {
    return app.loadEnums();
  });

  it('.getUserInfo()', function() {
    return app.getUserInfo();
  });

  it('.searchEntities()', function() {
    const filter = {
      conditions: [
        {
          property: 'name',
          operator: 'contains',
          value: 'adm'
        }
      ]
    };
    return app.searchEntities('sec$User', filter);
  })

});