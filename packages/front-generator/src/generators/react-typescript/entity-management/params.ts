import {StudioTemplateProperty, StudioTemplatePropertyType} from "../../../common/studio/studio-model";
import {Entity, View} from "../../../common/model/cuba-model";

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

export type EntityManagementListType = 'table' | 'list' | 'cards';

export interface EntityManagementAnswers {
  entity: Entity;
  managementComponentName: string;
  listType: EntityManagementListType;
  listComponentName: string;
  listView: View;
  editComponentName: string;
  editView: View;
  nestedEntityInfo: Record<string, string>;
}
