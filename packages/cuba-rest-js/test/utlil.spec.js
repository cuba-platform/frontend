const assert = require('assert');

const util = require('../dist-node/util');

describe('util', function() {

  it('.base64()', function() {
    assert.equal(util.base64encode('lorem ipsum'), 'bG9yZW0gaXBzdW0=');
  });

  describe('.encodeGetParams()', function() {
    it ('converts own properties to get params list', function() {
      assert.equal(util.encodeGetParams({a: 'b'}), 'a=b');
    });
    it ('encodes URL unsafe symbols', function() {
      assert.equal(util.encodeGetParams({a: '?', b: 'абв'}), 'a=%3F&b=%D0%B0%D0%B1%D0%B2');
    });
    it ('serializes nested objects as JSON', function() {
      assert.equal(util.encodeGetParams({a: {c: 'd', f: '%'}}), "a=%7B%22c%22%3A%22d%22%2C%22f%22%3A%22%25%22%7D");
    });
  });

});
