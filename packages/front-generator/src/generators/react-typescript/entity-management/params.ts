import {StudioTemplateProperty, StudioTemplatePropertyType} from "../../../common/studio/studio-model";
import {Entity, View} from "../../../common/model/cuba-model";
import {BaseEntityScreenAnswers} from '../common/base-entity-screen-generator/params';

export const entityManagementGeneratorParams: StudioTemplateProperty[] = [
  {
    code: 'entity',
    caption: 'Entity',
    propertyType: StudioTemplatePropertyType.ENTITY,
    required: true
  },
  {
    code: 'managementComponentName',
    caption: 'CRUD component class',
    propertyType: StudioTemplatePropertyType.POLYMER_COMPONENT_NAME,
    defaultValue: "Management",
    required: true
  },
  {
    code: 'listType',
    caption: 'List type',
    propertyType: StudioTemplatePropertyType.OPTION,
    defaultValue: "Cards",
    required: true,
    options: ['table', 'cards', 'list']
  },
  {
    code: 'listComponentName',
    caption: 'List component class',
    propertyType: StudioTemplatePropertyType.POLYMER_COMPONENT_NAME,
    defaultValue: "List",
    required: true
  },
  {
    code: 'listView',
    caption: 'List view',
    propertyType: StudioTemplatePropertyType.VIEW,
    relatedProperty: "entity",
    required: true
  },
  {
    code: 'editComponentName',
    caption: 'Edit component class name',
    propertyType: StudioTemplatePropertyType.POLYMER_COMPONENT_NAME,
    defaultValue: 'Edit',
    required: true
  },
  {
    code: 'editView',
    caption: 'Edit view',
    propertyType: StudioTemplatePropertyType.VIEW,
    relatedProperty: "entity",
    required: true
  }
];

export const listShowIdQuestions = [
  // The view in the exported project model never contains the ID attribute.
  // Therefore we are asking whether the ID attribute shall be shown in the List component.
  {
    code: 'listShowIdAttr',
    caption: 'Show ID attribute in the List component?',
    propertyType: StudioTemplatePropertyType.BOOLEAN,
    required: true
  }
  // For StringId entities we always show the ID field in the Edit component
  // as it is required to create the entities.
];

export const listIdPositionQuestion = {
  code: 'listIdAttrPos',
  caption: 'Position of the ID attribute in the List component \n' +
    '(behaves like an array index, e.g. enter 0 for the ID to appear as the first row/column, \n' +
    '-1 for next-to-last, etc.).',
  propertyType: StudioTemplatePropertyType.INTEGER,
  required: true
};

export const editIdPositionQuestion = {
  code: 'editIdAttrPos',
  caption: 'Position of the ID attribute in the Edit component \n' +
    '(behaves like an array index, e.g. enter 0 for the ID to appear as the first field of the form, \n' +
    '-1 for next-to-last, etc.).',
  propertyType: StudioTemplatePropertyType.INTEGER,
  required: true
};

export type EntityManagementListType = 'table' | 'list' | 'cards';

export interface EntityManagementAnswers extends BaseEntityScreenAnswers {
  managementComponentName: string;
  listType: EntityManagementListType;
  listComponentName: string;
  listView: View;
  editComponentName: string;
  editView: View;
  nestedEntityInfo?: Record<string, string>;
}
