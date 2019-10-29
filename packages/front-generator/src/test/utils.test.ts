import {convertToUnixPath, elementNameToClass, fqnToName} from "../common/utils";
import * as assert from "assert";


describe('utils', function () {
  it("elementNameToClass", function () {
    assert.strictEqual(elementNameToClass('my-custom-el'), 'MyCustomEl');
    assert.strictEqual(elementNameToClass('x-f'), 'XF');
  });

  it(convertToUnixPath.name, function () {
    assert.strictEqual(convertToUnixPath('.\\some\\path'), './some/path');
  });

  it('should convert fqn name to valid TS class name ', function () {
    assert.strictEqual(fqnToName('com.company.mpg.entity.CarType'), 'com_company_mpg_entity_CarType');
    assert.strictEqual(fqnToName(''), '');
  });

});

