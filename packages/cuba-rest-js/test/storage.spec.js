const assert = require('assert');
const cuba = require('../dist-node/cuba');

describe('DefaultStorage', function () {
  describe('constructor', function () {
    it('creation', function () {
      assert.equal(typeof new cuba.DefaultStorage(), 'object');
    });
  });

  describe('.length', function () {
    const storage = new cuba.DefaultStorage();
    it('should be 0 for just created instance', function () {
      assert.equal(storage.length, 0);
    });
    it('should be incremented on items addition', function () {
      storage.setItem('item1', 'value1');
      storage.setItem('item2', 'value2');
      assert.equal(storage.length, 2);
    });
    it('should be decremented on items removing', function () {
      storage.removeItem('item2');
      assert.equal(storage.length, 1)
    })
  });

  describe('#setItem()', function () {
    const storage = new cuba.DefaultStorage();
    it('should add item', function () {
      storage.setItem('key1', 'value');
      assert.equal(storage.getItem('key1'), 'value');
    });
  });

  describe('#removeItem()', function() {
    const storage = new cuba.DefaultStorage();
    it('should remove item', function() {
      storage.setItem('item1', 'value1');
      storage.removeItem('item1');
      assert.equal(typeof storage.getItem('item1'), 'undefined');
    });
  });

  describe('#clear()', function () {
    it('clears all items', function () {
      const storage = new cuba.DefaultStorage();
      storage.setItem('item1', 1);
      storage.setItem('item2', 2);
      storage.clear();
      assert.equal(typeof storage.getItem('item1'), 'undefined');
      assert.equal(typeof storage.getItem('item2'), 'undefined');
      assert.equal(storage.length, 0);
    });
  });

  describe('#key()', function () {
    it('should throw an exception since not implemented', function () {
      const storage = new cuba.DefaultStorage();
      storage.setItem('item1', 'value1');
      assert.throws(() => storage.key(0), Error);
    });
  })

});