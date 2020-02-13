"use strict";

const assert = require('assert');
const cuba = require('../dist-node/cuba.js');
global.fetch = require('node-fetch');

const apiUrl = 'http://localhost:8080/app/rest/';

let app;

before(function () {
  app = new cuba.CubaApp('', apiUrl);
  return app.login('admin', 'admin');
});

describe('CubaApp', function () {

  let app;
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

  before(function () {
    app = new cuba.CubaApp('', apiUrl);
    return app.login('admin', 'admin');
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
    it('should create new entity and pass persisted one in promise', function () {
      const role = {
        name: 'cuba-rest-test-role-' + Math.random(),
        description: 'Role for managers',
        type: 'READONLY'
      };

      return app
        .commitEntity('sec$Role', role)
        .then(function (createdEntity) {
          return app.loadEntity('sec$Role', createdEntity.id)
        })
        .then((entity) => {
          assert.strictEqual(entity.name, role.name);
          assert(entity.id != null);
        });
    });

    it('should update existing entity', async () => {
      const managersRole = {
        id: '91099ca3-194e-6ba5-7aa6-15b03bcef05a',
        description: 'Updated role description'
      };
      return app.commitEntity('sec$Role', managersRole)
        .then(() => app.loadEntity('sec$Role', managersRole.id))
        .then((updatedRole) => assert(updatedRole.description === 'Updated role description'));
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
          assert(resp.result.length === 4, 'result array should contain 4 entities');
          assert(resp.count === 4, 'count should be 4');
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
          assert(resp.result.length === 4, 'result array should contain 4 entities, contains ' + resp.result.length);
          assert(resp.count === 4, 'count should be 4');
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
      return app
        .query('scr$Car', 'allCars')
        .then((cars) => assert(cars.length > 0));
    });

    it('should work with params', () => {
      return app
        .query('scr$Car', 'carsByType', {carType: 'SEDAN'})
        .then(cars => {
          assert(cars.length > 0);
          cars.forEach(c => assert(c.carType === 'SEDAN'))
        });
    })
  });

  describe('.invokeService()', function () {
    it('should invoke service without params and void result', function () {
      return app.invokeService('scr_FavoriteService', 'refreshCache');
    });

    it('should invoke service with params', function () {
      return app
        .invokeService('scr_FavoriteService', 'getFavoritesByType', {carType: 'SEDAN'})
        .then(favCars => assert(favCars.length > 0));
    });

    it('should not fail if null passed as params', function () {
      return app.invokeService('scr_FavoriteService', 'refreshCache', null);
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
