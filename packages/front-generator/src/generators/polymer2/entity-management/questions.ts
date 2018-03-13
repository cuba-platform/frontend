import {StudioTemplateProperty, StudioTemplatePropertyType} from "../../../studio/templating";

export const entityManagementQuestions: StudioTemplateProperty[] = [
  {
    code: 'entity',
    caption: 'Entity',
    propertyType: StudioTemplatePropertyType.ENTITY,
    required: true
  },
  {
    code: 'managementComponentName',
    caption: 'CRUD component name',
    propertyType: StudioTemplatePropertyType.POLYMER_COMPONENT_NAME,
    defaultValue: "-management",
    required: true
  },
  {
    code: 'listType',
    caption: 'List type',
    propertyType: StudioTemplatePropertyType.OPTION,
    defaultValue: "cards",
    required: true,
    options: ['cards', 'list']
  },
  {
    code: 'listComponentName',
    caption: 'List component name',
    propertyType: StudioTemplatePropertyType.POLYMER_COMPONENT_NAME,
    defaultValue: "-list",
    required: true
  },
  {
    code: 'listView',
    caption: 'List view',
    propertyType: StudioTemplatePropertyType.VIEW,
    relatedProperty: "entity",
    required: true
  }
];