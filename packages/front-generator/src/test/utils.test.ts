import {elementNameToClass} from "../common/utils";
import * as assert from "assert";

describe('utils', function () {
  it("elementNameToClass", function () {
    assert.equal(elementNameToClass('my-custom-el'),'MyCustomEl');
    assert.equal(elementNameToClass('x-f'), 'XF');
  });
});