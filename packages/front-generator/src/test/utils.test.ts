import {convertToUnixPath, elementNameToClass, fqnToName} from "../common/utils";
import * as assert from "assert";

describe('utils', function () {
  it("elementNameToClass", function () {
    assert.equal(elementNameToClass('my-custom-el'),'MyCustomEl');
    assert.equal(elementNameToClass('x-f'), 'XF');
  });

  it(convertToUnixPath.name, function() {
    assert.equal(convertToUnixPath('.\\some\\path'), './some/path');
  });

  it('should convert fqn name to valid TS class name ', function () {
    assert.equal(fqnToName('com.company.mpg.entity.CarType'), 'com_company_mpg_entity_CarType');
    assert.equal(fqnToName(''), '');
  });

});

