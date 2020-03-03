import {getDisplayedAttributes, ScreenType} from "../../../../generators/react-typescript/common/entity";
import {expect} from "chai";

const dtViewProperties = require('../../../fixtures/view-properties--datatypes-test-entity.json');
const o2oViewProperties = require('../../../fixtures/view-properties--association-o2o.json');
const dtEntityModel = require('../../../fixtures/entity-model--datatypes-test-entity.json');
const o2oEntityModel = require('../../../fixtures/entity-model--association-o2o.json');
const projectModel = require('../../../fixtures/project-model--scr.json');

describe('getDisplayedAttributes()', () => {
  let dtBrowserDisplayedFields: string[];
  let dtEditorDisplayedFields: string[];
  let o2oDisplayedFieldsBrowser: string[];

  before(() => {
    const dtBrowserEntityAttrs = getDisplayedAttributes(dtViewProperties, dtEntityModel, projectModel, ScreenType.BROWSER);
    dtBrowserDisplayedFields = dtBrowserEntityAttrs.map(attr => attr.name);
    const dtEditorEntityAttrs = getDisplayedAttributes(dtViewProperties, dtEntityModel, projectModel, ScreenType.EDITOR);
    dtEditorDisplayedFields = dtEditorEntityAttrs.map(attr => attr.name);
    const o2oEntityAttrs = getDisplayedAttributes(o2oViewProperties, o2oEntityModel, projectModel, ScreenType.BROWSER);
    o2oDisplayedFieldsBrowser = o2oEntityAttrs.map(attr => attr.name);
  });

  it('does not include one to many associations', () => {
    expect(dtBrowserDisplayedFields).to.not.include('associationO2Mattr');
  });

  it('does not include byte arrays', () => {
    expect(dtBrowserDisplayedFields).to.not.include('byteArrayAttr');
  });

  it('does not include many to many associations (browser)', () => {
    expect(dtBrowserDisplayedFields).to.not.include('associationM2Mattr');
  });

  it('includes many to many associations (editor)', () => {
    expect(dtEditorDisplayedFields).to.include('associationM2Mattr');
  });

  it('includes all other properties', () => {
    const propertiesSet = [
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
    ];
    expect(dtBrowserDisplayedFields).to.include.members(propertiesSet);
    expect(dtEditorDisplayedFields).to.include.members(propertiesSet);
    expect(o2oDisplayedFieldsBrowser).to.include.members(['name', 'datatypesTestEntity']);
  });
});
