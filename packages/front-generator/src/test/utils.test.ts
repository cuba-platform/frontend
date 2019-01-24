import {convertToUnixPath, elementNameToClass} from "../common/utils";
import * as assert from "assert";

describe('utils', function () {
  it("elementNameToClass", function () {
    assert.equal(elementNameToClass('my-custom-el'),'MyCustomEl');
    assert.equal(elementNameToClass('x-f'), 'XF');
  });

  it(convertToUnixPath.name, function() {
    assert.equal(convertToUnixPath('.\\some\\path'), './some/path');
  })
});