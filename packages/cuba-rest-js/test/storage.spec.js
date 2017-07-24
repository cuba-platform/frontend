const assert = require('assert');
const cuba = require('../dist-node/cuba');

describe('DefaultStorage', function () {
  describe('constructor', function () {
    it('creation', function () {
      assert.equal(typeof new cuba.DefaultStorage(), 'object');
    });
  });

  describe('#setItem()', function () {
    const storage = new cuba.DefaultStorage();
    it('basic', function () {
      storage.setItem('key1', 'value');
      assert.equal(storage.getItem('key1'), 'value');
    });
  });

  describe('#clear()', function() {
    it('clears all items', function () {
      const storage = new cuba.DefaultStorage();
      storage.setItem('item1', 1);
      storage.setItem('item2', 2);
    })
  });

});