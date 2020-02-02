import {convertToUnixPath, elementNameToClass, fqnToName, splitByCapitalLetter} from "../common/utils";
import * as assert from "assert";
import { expect } from "chai";


describe('utils', () => {
  it("elementNameToClass", () => {
    assert.strictEqual(elementNameToClass('my-custom-el'), 'MyCustomEl');
    assert.strictEqual(elementNameToClass('x-f'), 'XF');
    assert.strictEqual(elementNameToClass('myCustomEl'), 'MyCustomEl');
    assert.strictEqual(elementNameToClass('my custom El'), 'MyCustomEl');
    assert.strictEqual(elementNameToClass('  my   veryCustom  El   '), 'MyVeryCustomEl');
    assert.strictEqual(elementNameToClass('~!@#%^&*()_+the Cla$$'), '_theCla$$');
  });

  it(convertToUnixPath.name, () => {
    assert.strictEqual(convertToUnixPath('.\\some\\path'), './some/path');
  });

  it('should convert fqn name to valid TS class name ', () => {
    assert.strictEqual(fqnToName('com.company.mpg.entity.CarType'), 'com_company_mpg_entity_CarType');
    assert.strictEqual(fqnToName(''), '');
  });

  it('should split string by capital letter', () => {
    expect(splitByCapitalLetter('splitByCapital')).eq('split By Capital');
    expect(splitByCapitalLetter('SplitByCapital')).eq('Split By Capital');
    expect(splitByCapitalLetter('split123It')).eq('split123 It');
    expect(splitByCapitalLetter('split$It')).eq('split$ It');
    expect(splitByCapitalLetter('split_It')).eq('split_ It');
  });

});

