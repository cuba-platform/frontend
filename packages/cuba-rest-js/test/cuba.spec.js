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

describe('.matchesVersion()', function () {
  it('should compare versions correctly', async function () {
    const matchesVersion = cuba.matchesVersion;
    assert( matchesVersion('7.2.0', '7.2.0'));
    assert( matchesVersion('7.2.1', '7.2.0'));
    assert( matchesVersion('7.3.0', '7.2.0'));
    assert( matchesVersion('8.2.0', '7.2.0'));
    assert( matchesVersion('7.2-SNAPSHOT', '7.2.0'));

    assert(!matchesVersion('7.2.0', '7.2.1'));
    assert(!matchesVersion('7.2.0', '7.3.0'));
    assert(!matchesVersion('7.2.0', '8.2.0'));
    assert(!matchesVersion('7.2-SNAPSHOT', '7.2.1'));
    assert(!matchesVersion('7.2-SNAPSHOT', '7.3.0'));
    assert(!matchesVersion('0', '7.2.0'));
    assert(!matchesVersion(undefined, '7.2.0'));
    assert(!matchesVersion(null, '7.2.0'));
    assert(!matchesVersion('A string that cannot be converted to a semver', '7.2.0'));

    assert.throws(() => matchesVersion('7.2.0', undefined));
    assert.throws(() => matchesVersion('7.2.0', null));
    assert.throws(() => matchesVersion('7.2.0', 'A string that cannot be converted to a semver'));
  })
});

describe('CubaApp', function () {

  let app;

  before(function () {
    app = new cuba.CubaApp('', apiUrl);
    return app.login('admin', 'admin');
  });

  describe('.login()', function () {
    it('shouldn\'t work with bad credentials', function (done) {
      const newApp = new cuba.CubaApp('', apiUrl);
      newApp.login('admin', 'admin2')
        .then(() => {
          done('works with bad credentials');
        })
        .catch(() => {
          done()
        });
    });
    it('should not work with empty credentials', function(done) {
      const newApp = new cuba.CubaApp('', apiUrl);
      newApp.login(null, null)
        .then(() => {
          done('works with empty credentials');
        })
        .catch(() => {
          done();
        });
    });
    it('should work with right credentials', function () {
      const newApp = new cuba.CubaApp('', apiUrl);
      return newApp.login('admin', 'admin');
    });
  });


  it('.loadMetadata()', function () {
    return app.loadMetadata();
  });

  it('.loadMessages()', function () {
    return app.loadEntitiesMessages();
  });

  it('.loadEnums()', function () {
    return app.loadEnums();
  });

  it('.getUserInfo()', function () {
    return app.getUserInfo();
  });

  it('.loadEntity()', function (done) {
    app.loadEntity('sec$User', 'a405db59-e674-4f63-8afe-269dda788fe8')
      .then((entity) => {
        assert(entity._instanceName != null);
        done();
      })
      .catch((e) => {
        done(e)
      });
  });

  describe('.commitEntity()', function () {
    it('should create new entity and pass persisted one in promise', function (done) {
      const role = {
        name: 'Manager',
        description: 'Role for managers',
        type: 'READONLY'
      };

      app.commitEntity('sec$Role', role)
        .then(function (createdEntity) {
          app.loadEntity('sec$Role', createdEntity.id).then((entity) => {
            assert.strictEqual(entity.name, role.name);
            assert(entity.id != null);
            done();
          });
        })
        .catch(function (e) {
          done(e);
        });
    });

    it('should update existing entity', function (done) {
      const admRole = {
        id: '0c018061-b26f-4de2-a5be-dff348347f93',
        description: 'Updated role description'
      };
      app.commitEntity('sec$Role', admRole)
        .then(function () {
          app.loadEntity('sec$Role', admRole.id).then((updatedRole) => {
            assert(updatedRole.description === admRole.description);
            done();
          });
        })
        .catch(function (e) {
          done(e);
        })
    });
  });

  describe('.deleteEntity()', function () {
    it('should delete entity', function (done) {
      app.commitEntity('sec$Role', {name: 'newRole'}).then(function (newRole) {
        app.deleteEntity('sec$Role', newRole.id)
          .then(function () {
            done();
          })
          .catch(function (e) {
            done(e);
          });
      })
    });

  });

  describe('.loadEntities()', function () {
    it('should load list of entities', function (done) {
      const options = {
        view: '_minimal',
        limit: 1,
      };
      app.loadEntities('sec$User', options)
        .then(function (users) {
          assert.strictEqual(users.length, 1);
          assert.ok(!users[0].hasOwnProperty('password'));
          assert(users[0]._instanceName != null);
          done();
        })
        .catch(function (e) {
          done(e);
        });
    });
  });

  describe('.loadEntitiesWithCount()', function () {
    it('should return entities and count', function (done) {
      app.loadEntitiesWithCount('sec$User')
        .then(function (resp) {
          assert(Array.isArray(resp.result), '.result is not array');
          assert(resp.result.length === 2, 'result array should contain 2 entities');
          assert(resp.count === 2, 'count should be 2');
          assert(resp.result[0]._instanceName != null);
          done();
        })
        .catch(function (e) {
          done(e)
        });
    })
  });

  const simpleFilter = {
    conditions: [{
      property: 'name',
      operator: 'contains',
      value: 'adm'
    }]
  };

  const groupConditionsFilter = {
    conditions: [{
      group: 'OR',
      conditions: [{
        property: 'name',
        operator: 'contains',
        value: 'adm'
      }, {
        property: 'active',
        operator: '=',
        value: true
      }]
    }]
  };

  describe('.searchEntities()', function () {
    it('should search entities by a simple condition', function () {
      return app.searchEntities('sec$User', simpleFilter);
    });
    it('should search group conditions', function () {
      return app.searchEntities('sec$User', groupConditionsFilter);
    })
  });

  describe('.searchEntitiesWithCount()', function () {
    it('should search entities by a simple condition', function (done) {
      app.searchEntitiesWithCount('sec$User', simpleFilter)
        .then(function (resp) {
          assert(Array.isArray(resp.result), '.result is not array');
          assert(resp.result.length === 1, 'result array should contain 1 entities, contains ' + resp.result.length);
          assert(resp.count === 1, 'count should be 1');
          assert(resp.result[0]._instanceName != null);
          done();
        })
        .catch(function (e) {
          done(e)
        });
    });
    it('should search group conditions', function (done) {
      app.searchEntitiesWithCount('sec$User', groupConditionsFilter)
        .then(function (resp) {
          assert(Array.isArray(resp.result), '.result is not array');
          assert(resp.result.length === 2, 'result array should contain 2 entities, contains ' + resp.result.length);
          assert(resp.count === 2, 'count should be 2');
          assert(resp.result[0]._instanceName != null);
          done();
        })
        .catch(function (e) {
          done(e)
        });
    })
  });

  describe('.query()', function () {
    it('should load query results', function () {
      return app.query('sec$User', 'allUsers')
    });
    it('should work with params', function (done) {
      app.query('sec$User', 'userByLogin', {login: 'admin'})
        .then(function (users) {
          users.forEach((u) => {
            assert(u.login === 'admin');
          });
          done();
        })
        .catch((e) => {
          done(e);
        });
    })
  });

  describe('.invokeService()', function () {
    it('should invoke service without params and void result', function () {
      return app.invokeService('restmock_DummyService', 'voidNoParams');
    });
    it('should invoke service with params', function() {
      return app.invokeService('restmock_DummyService', 'voidWithParams', {
        stringParam: 'stringParam',
        intParam: 42
      });
    });
    it('should not fail if null passed as params', function () {
      return app.invokeService('restmock_DummyService', 'voidNoParams', null);
    })
  });

  describe('.loadEntityViews()', function () {
    it('should load entity views', async function () {
      const views = await app.loadEntityViews('sec$User');
      assert(Array.isArray(views));
    })
  });

  describe('.loadEntityView()', function () {
    it('should load particular view', async function () {
      const view = await app.loadEntityView('sec$User', 'user.browse');
      assert(typeof view === 'object');
    })
  });

  describe('.setSessionLocale()', function () {
    it('should set session locale', function () {
      return app.setSessionLocale();
    });
  });

  describe('.getApiVersion()', function () {
    it('should get API version', async function () {
      const version = await app.getApiVersion();
      assert(version);
      assert(version.length);
      assert(version.length > 0);
    });
  });

  describe('.refreshApiVersion()', function () {
    it('should refresh API version', async function () {
      const version = await app.refreshApiVersion();
      assert.equal(version, app.apiVersion);
    })
  });

  describe('.onLocaleChange()', function() {
    it('invokes a callback on locale change', function(done) {
      const callback = () => done();
      app.onLocaleChange(callback);
      app.locale = 'en';
    });
  });

});

describe('CubaApp version <7.2.0', function () {

  let app;
  const initApiVersion = '5.5.5';

  before(function () {
    this.timeout(20000);
    app = new cuba.CubaApp('', apiUrl, undefined, undefined, undefined, undefined, initApiVersion);
    return app.login('admin', 'admin');
  });

  describe('.setSessionLocal()', function(done) {
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

describe('CubaApp not logged in', function() {
  describe('.setSessionLocal()', function() {
    it('should fail if not logged in', function(done) {
      const app = new cuba.CubaApp('', apiUrl);
      app.setSessionLocale()
        .then(() => {
          done('did not fail');
        })
        .catch(reason => {
          done();
        })
    });
  });
});
