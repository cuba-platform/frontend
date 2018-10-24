import {StudioTemplateProperty, StudioTemplatePropertyType} from "../../../common/cuba-studio";

export const blankComponentParams: StudioTemplateProperty[] = [
  {
    caption: "Component name",
    code: "componentName",
    propertyType: StudioTemplatePropertyType.POLYMER_COMPONENT_NAME,
    required: true
  }
];