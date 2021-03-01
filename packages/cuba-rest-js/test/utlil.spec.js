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

  describe('.matchesVersion()', function () {
    it('should compare versions correctly', async function () {
      const matchesVersion = util.matchesVersion;
      assert(matchesVersion('7.2.0', '7.2.0'));
      assert(matchesVersion('7.2.1', '7.2.0'));
      assert(matchesVersion('7.3.0', '7.2.0'));
      assert(matchesVersion('7.3.0', '7.2.9'));
      assert(matchesVersion('7.2.10', '7.2.2'));
      assert(matchesVersion('7.2.0', '7.2'));
      assert(matchesVersion('7.10.0', '7.9.0'));
      assert(matchesVersion('7.02.0', '7.2.0'));
      assert(matchesVersion('8.2.0', '7.2.0'));
      assert(matchesVersion('7.2-SNAPSHOT', '7.2.0'));
      assert(matchesVersion('7.2.0-SNAPSHOT', '7.2.0'));
      assert(matchesVersion('7.2beta', '7.2.0'));
      assert(matchesVersion('7.2.beta', '7.2.0'));

      assert(!matchesVersion('7.2.0', '7.2.1'));
      assert(!matchesVersion('7.2.0', '7.3.0'));
      assert(!matchesVersion('7.2.0', '8.2.0'));
      assert(!matchesVersion('7.2-SNAPSHOT', '7.2.1'));
      assert(!matchesVersion('7.2-SNAPSHOT', '7.3.0'));
      assert(!matchesVersion('7.2.0-SNAPSHOT', '7.2.1'));
      assert(!matchesVersion('0', '7.2.0'));
      assert(!matchesVersion(undefined, '7.2.0'));
      assert(!matchesVersion(null, '7.2.0'));
      assert(!matchesVersion('A string that cannot be converted to a semver', '7.2.0'));

      assert.throws(() => matchesVersion('7.2.0', undefined));
      assert.throws(() => matchesVersion('7.2.0', null));
      assert.throws(() => matchesVersion('7.2.0', 'A string that cannot be converted to a semver'));
    })
  });

  describe('.getStringId()', function() {
    const stringId = 'tested id';
    const objId = {testFld: "tested id"};
    it ('return source id, if it has string type', function() {
      assert.equal(util.getStringId(stringId), stringId);
    });
    it ('return converted id, if it has object type', function() {
      assert.equal(util.getStringId(objId), "eyJ0ZXN0RmxkIjoidGVzdGVkIGlkIn0=");
    });
  });

});
