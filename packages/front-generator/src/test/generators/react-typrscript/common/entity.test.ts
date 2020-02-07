import {getDisplayedAttributes} from "../../../../generators/react-typescript/common/entity";
import {expect} from "chai";

const dtViewProperties = require('../../../fixtures/view-properties--datatypes-test-entity.json');
const o2oViewProperties = require('../../../fixtures/view-properties--association-o2o.json');
const dtEntityModel = require('../../../fixtures/entity-model--datatypes-test-entity.json');
const o2oEntityModel = require('../../../fixtures/entity-model--association-o2o.json');
const projectModel = require('../../../fixtures/project-model--scr.json');

describe('getDisplayedAttributes()', () => {
  let dtDisplayedFields: string[];
  let o2oDisplayedFields: string[];

  before(() => {
    const dtEntityAttrs = getDisplayedAttributes(dtViewProperties, dtEntityModel, projectModel);
    dtDisplayedFields = dtEntityAttrs.map(attr => attr.name);
    const o2oEntityAttrs = getDisplayedAttributes(o2oViewProperties, o2oEntityModel, projectModel);
    o2oDisplayedFields = o2oEntityAttrs.map(attr => attr.name);
  });

  it('does not include one to many associations', () => {
    expect(dtDisplayedFields).to.not.include('associationO2Mattr');
  });

  it('does not include one to one associations on the inverse side', () => {
    expect(o2oDisplayedFields).to.not.include('datatypesTestEntity');
  });

  it('does not include byte arrays', () => {
    expect(dtDisplayedFields).to.not.include('byteArrayAttr');
  });

  it('includes all other properties', () => {
    expect(dtDisplayedFields).to.include.members([
      'bigDecimalAttr',
      'booleanAttr',
      'dateAttr',
      'dateTimeAttr',
      'doubleAttr',
      'integerAttr',
      'longAttr',
      'stringAttr',
      'timeAttr',
      'uuidAttr',
      'localDateTimeAttr',
      'offsetDateTimeAttr',
      'localDateAttr',
      'localTimeAttr',
      'offsetTimeAttr',
      'enumAttr',
      'name',
      'associationO2Oattr',
      'associationM2Oattr',
      'associationM2Mattr',
    ]);
    expect(o2oDisplayedFields).to.include('name');
  });
});