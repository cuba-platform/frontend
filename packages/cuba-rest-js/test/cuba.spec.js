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

describe('CubaApp', function () {

  let app;

  before(function () {
    app = new cuba.CubaApp('', apiUrl);
  });

  describe('.login()', function () {
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


  it('.loadMetadata()', function () {
    return app.loadMetadata();
  });

  it('.loadEnums()', function () {
    return app.loadEnums();
  });

  it('.getUserInfo()', function () {
    return app.getUserInfo();
  });

  describe('.loadEntities()', function() {
    it('should load list of entities', function() {
      const options = {
        view: '_minimal',
        limit: 1,
      };
      let loadPromise = app.loadEntities('sec$User', options);
      loadPromise.then((users) => {
        assert.equal(users.length, 1);
        assert.ok(!users[0].hasOwnProperty('password'));
      });
      return loadPromise;
    });
  });

  describe('.loadEntitiesWithCount()', function() {
    it('should return entities and count', function(done) {
      app.loadEntitiesWithCount('sec$User')
        .then(function(resp) {
          if(!Array.isArray(resp.result)) throw new Error('.result is not array');
          if(resp.result.length !== 2) throw new Error('result should contain 2 entities');
          if(resp.count !== 2) throw new Error('count should be 2');

          done();
        })
        .catch(function(e) {
          done(e)
        });
    })
  });

  describe('.searchEntities()', function () {
    it('should search entities by a simple condition', function () {
      const filter = {
        conditions: [{
          property: 'name',
          operator: 'contains',
          value: 'adm'
        }]
      };
      return app.searchEntities('sec$User', filter);
    });
    it('should search group conditions', function () {
      const filter = {
        conditions: [{
          group: 'OR',
          conditions: [{
            property: 'name',
            operator: 'contains',
            value: 'adm'
          },{
            property: 'active',
            operator: '=',
            value: true
          }]
        }]
      };
      return app.searchEntities('sec$User', filter);
    })
  })

});