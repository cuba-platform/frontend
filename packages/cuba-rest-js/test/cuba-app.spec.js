"use strict";

const assert = require('assert');
global.fetch = require('node-fetch');
const {initApp} = require('./common');

let app;

beforeAll(() => {
  app = initApp();
  return app.login('admin', 'admin');
});

describe('CubaApp', () => {

  let app;
  describe('.login()', () => {
    it('shouldn\'t work with bad credentials', done => {
      const newApp = initApp();
      newApp.login('admin', 'admin2')
        .then(() => {
          done('works with bad credentials');
        })
        .catch(() => {
          done()
        });
    });
    it('should not work with empty credentials', done => {
      const newApp = initApp();
      newApp.login(null, null)
        .then(() => {
          done('works with empty credentials');
        })
        .catch(() => {
          done();
        });
    });
    it('should work with right credentials', () => {
      const newApp = initApp();
      return newApp.login('admin', 'admin');
    });
  });

  beforeAll(() => {
    app = initApp();
    return app.login('admin', 'admin');
  });


  it('.loadMetadata()', () => app.loadMetadata());

  it('.loadMessages()', () => app.loadEntitiesMessages());

  it('.loadEnums()', () => app.loadEnums());

  it('.getUserInfo()', () => app.getUserInfo());

  it('.loadEntity()', done => {
    app.loadEntity('sec$User', 'a405db59-e674-4f63-8afe-269dda788fe8')
      .then((entity) => {
        assert(entity._instanceName != null);
        done();
      })
      .catch((e) => {
        done(e)
      });
  });

  describe('.commitEntity()', () => {
    it('should create new entity and pass persisted one in promise', () => {
      const role = {
        name: 'cuba-rest-test-role-' + Math.random(),
        description: 'Role for managers',
        type: 'READONLY'
      };

      return app
        .commitEntity('sec$Role', role)
        .then(createdEntity => app.loadEntity('sec$Role', createdEntity.id))
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

  describe('.deleteEntity()', () => {
    it('should delete entity', done => {
      app.commitEntity('sec$Role', {name: 'newRole'}).then(newRole => {
        app.deleteEntity('sec$Role', newRole.id)
          .then(() => {
            done();
          })
          .catch(e => {
            done(e);
          });
      })
    });

  });

  describe('.loadEntities()', () => {
    it('should load list of entities', done => {
      const options = {
        view: '_minimal',
        limit: 1,
      };
      app.loadEntities('sec$User', options)
        .then(users => {
          assert.strictEqual(users.length, 1);
          assert.ok(!users[0].hasOwnProperty('password'));
          assert(users[0]._instanceName != null);
          done();
        })
        .catch(e => {
          done(e);
        });
    });
  });

  describe('.loadEntitiesWithCount()', () => {
    it('should return entities and count', done => {
      app.loadEntitiesWithCount('sec$User')
        .then(resp => {
          assert(Array.isArray(resp.result), '.result is not array');
          assert(resp.result.length === 4, 'result array should contain 4 entities');
          assert(resp.count === 4, 'count should be 4');
          assert(resp.result[0]._instanceName != null);
          done();
        })
        .catch(e => {
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

  describe('.searchEntities()', () => {
    it('should search entities by a simple condition', () => app.searchEntities('sec$User', simpleFilter));
    it('should search group conditions', () => app.searchEntities('sec$User', groupConditionsFilter))
  });

  describe('.searchEntitiesWithCount()', () => {
    it('should search entities by a simple condition', done => {
      app.searchEntitiesWithCount('sec$User', simpleFilter)
        .then(resp => {
          assert(Array.isArray(resp.result), '.result is not array');
          assert(resp.result.length === 1, 'result array should contain 1 entities, contains ' + resp.result.length);
          assert(resp.count === 1, 'count should be 1');
          assert(resp.result[0]._instanceName != null);
          done();
        })
        .catch(e => {
          done(e)
        });
    });
    it('should search group conditions', done => {
      app.searchEntitiesWithCount('sec$User', groupConditionsFilter)
        .then(resp => {
          assert(Array.isArray(resp.result), '.result is not array');
          assert(resp.result.length === 4, 'result array should contain 4 entities, contains ' + resp.result.length);
          assert(resp.count === 4, 'count should be 4');
          assert(resp.result[0]._instanceName != null);
          done();
        })
        .catch(e => {
          done(e)
        });
    })
  });

  describe('.query()', () => {

    it('should load query results', () => app
      .query('scr$Car', 'allCars')
      .then((cars) => assert(cars.length > 0)));

    it('should work with params', () => {
      return app
        .query('scr$Car', 'carsByType', {carType: 'SEDAN'})
        .then(cars => {
          assert(cars.length > 0);
          cars.forEach(c => assert(c.carType === 'SEDAN'))
        });
    })
  });

  describe('.invokeService()', () => {
    it('should invoke service without params and void result', () => app.invokeService('scr_FavoriteService', 'refreshCache'));

    it('should invoke service with params', () => app
      .invokeService('scr_FavoriteService', 'getFavoritesByType', {carType: 'SEDAN'})
      .then(favCars => assert(favCars.length > 0)));

    it('should not fail if null passed as params', () => app.invokeService('scr_FavoriteService', 'refreshCache', null))
  });

  describe('.loadEntityViews()', () => {
    it('should load entity views', async () => {
      const views = await app.loadEntityViews('sec$User');
      assert(Array.isArray(views));
    })
  });

  describe('.loadEntityView()', () => {
    it('should load particular view', async () => {
      const view = await app.loadEntityView('sec$User', 'user.browse');
      assert(typeof view === 'object');
    })
  });

  describe('.setSessionLocale()', () => {
    it('should set session locale', () => app.setSessionLocale());
  });

  describe('.getApiVersion()', () => {
    it('should get API version', async () => {
      const version = await app.getApiVersion();
      assert(version);
      assert(version.length);
      assert(version.length > 0);
    });
  });

  describe('.refreshApiVersion()', () => {
    it('should refresh API version', async () => {
      const version = await app.refreshApiVersion();
      assert.equal(version, app.apiVersion);
    })
  });

  describe('.onLocaleChange()', () => {
    it('invokes a callback on locale change', done => {
      const callback = () => done();
      app.onLocaleChange(callback);
      app.locale = 'en';
    });
  });

});

