const assert = require('assert');

global.localStorage = new require('node-localstorage').LocalStorage('.local-storage');
global.fetch = new require('node-fetch');

const apiUrl = 'http://localhost:8080/app/rest/';


describe('cuba', function () {

  let cuba;

  beforeEach(function () {
    cuba = require('../dist-node/cuba.js');
  });

  afterEach(function () {
    delete require.cache[require.resolve('../dist-node/cuba.js')];
  });


  describe('#initializeApp()', function () {
    it('simple initialization', function () {
      let app = typeof cuba.initializeApp({});
      assert.equal(app, 'object');
    });
    it('initialization with the same name fails', function (done) {
      try {
        cuba.initializeApp({});
        cuba.initializeApp({});
        done('initialized twice');
      } catch (e) {
        done()
      }
    });
  });



  describe('#getApp()', function () {
    it('initialize and retrieve - default config', function () {
      let app = cuba.initializeApp({});
      assert.equal(app, cuba.getApp());
    });
  });

  describe('cubaApp', function() {

    describe('#login()', function () {
      it('should work with right credentials', function () {
        const app = cuba.initializeApp({apiUrl: apiUrl});
        return app.login('admin', 'admin');
      });

      it('shouldn\'t work with bad credentials', function (done) {
        const app = cuba.initializeApp({apiUrl: apiUrl});
        app.login('admin', 'admin2')
          .then(() => {
            done('works with bad credentials');
          })
          .catch((e) => {
            done()
          });
      })
    });

  });

});