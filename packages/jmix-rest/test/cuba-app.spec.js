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
    app.loadEntity('scr_User', '60885987-1b61-4247-94c7-dff348347f93')
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
      const car = {
        model: 'car-' + Math.random(),
        manufacturer: 'Manufacturer',
        carType: "SEDAN"
      };

      return app
        .commitEntity('scr$Car', car)
        .then(createdEntity => app.loadEntity('scr$Car', createdEntity.id))
        .then((entity) => {
          assert.strictEqual(entity.model, car.model);
          assert(entity.id != null);
        });
    });

    it('should update existing entity', async () => {
      const car = {
        id: '3da61043-aaad-7e30-c7f5-c1f1328d3980',
        model: '2122'
      };

      const fetchOptions = {
        commitMode: 'edit'
      }

      return app.commitEntity('scr$Car', car, fetchOptions)
        .then(() => app.loadEntity('scr$Car', car.id))
        .then((updatedCar) => assert(updatedCar.model === '2122'));
    });
  });

  describe('.deleteEntity()', () => {
    it('should delete entity', done => {
      app.commitEntity('scr$Car', {manufacturer: "VAZ", carType: 'SEDAN'}).then(car => {
        app.deleteEntity('scr$Car', car.id)
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
        view: '_instance_name',
        limit: 1,
      };
      app.loadEntities('scr$Car', options)
        .then(cars => {
          assert.strictEqual(cars.length, 1);
          assert.ok(!cars[0].hasOwnProperty('price'));
          assert(cars[0]._instanceName != null);
          done();
        })
        .catch(e => {
          done(e);
        });
    });
  });

  describe('.loadEntitiesWithCount()', () => {
    it('should return entities and count', done => {
      app.loadEntitiesWithCount('scr_User')
        .then(resp => {
          assert(Array.isArray(resp.result), '.result is not array');
          assert(resp.result.length === 1, 'result array should contain 4 entities');
          assert(resp.count === 1, 'count should be 1');
          done();
        })
        .catch(e => {
          done(e)
        });
    })
  });

  const simpleFilter = {
    conditions: [{
      property: 'username',
      operator: 'contains',
      value: 'adm'
    }]
  };

  const groupConditionsFilter = {
    conditions: [{
      group: 'OR',
      conditions: [{
        property: 'username',
        operator: 'contains',
        value: 'adm'
      }, {
        property: 'enabled',
        operator: '=',
        value: true
      }]
    }]
  };

  describe('.searchEntities()', () => {
    it('should search entities by a simple condition', () => app.searchEntities('scr_User', simpleFilter));
    it('should search group conditions', () => app.searchEntities('scr_User', groupConditionsFilter))
  });

  describe('.searchEntitiesWithCount()', () => {
    it('should search entities by a simple condition', done => {
      app.searchEntitiesWithCount('scr_User', simpleFilter)
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
      app.searchEntitiesWithCount('scr_User', groupConditionsFilter)
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
    })
  });

  // todo https://github.com/Haulmont/jmix-frontend/issues/102
  xdescribe('.query()', () => {

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
      const views = await app.loadEntityViews('scr_User');
      assert(Array.isArray(views));
    })
  });

  xdescribe('.loadEntityView()', () => {
    it('should load particular view', async () => {
      const view = await app.loadEntityView('sec$User', 'user.browse');
      assert(typeof view === 'object');
    })
  });

  xdescribe('.setSessionLocale()', () => {
    it('should set session locale', () => app.setSessionLocale());
  });

  xdescribe('.getApiVersion()', () => {
    it('should get API version', async () => {
      const version = await app.getApiVersion();
      assert(version);
      assert(version.length);
      assert(version.length > 0);
    });
  });

  xdescribe('.refreshApiVersion()', () => {
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

