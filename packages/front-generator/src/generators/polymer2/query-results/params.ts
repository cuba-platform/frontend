import {StudioTemplateProperty, StudioTemplatePropertyType} from "../../../common/cuba-studio";

export const queryResultParams: StudioTemplateProperty[] = [
  {
    caption: "Query",
    code: "query",
    propertyType: StudioTemplatePropertyType.REST_QUERY,
    required: true
  },
  {
    caption: "Component name",
    code: "componentName",
    propertyType: StudioTemplatePropertyType.POLYMER_COMPONENT_NAME,
    defaultValue: "-list",
    required: true
  }
];