const assert = require('assert');

const apiUrl = 'http://localhost:8080/app/rest';


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

  describe('#getApp()', function() {
    it('initialize and retrieve - default config', function() {
      let app = cuba.initializeApp();
    })
  });


  it('#login()', function () {
    const app = cuba.initializeApp({apiUrl: apiUrl});
    app.login('admin', 'admin');
  })
});