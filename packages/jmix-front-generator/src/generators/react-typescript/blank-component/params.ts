import {StudioTemplateProperty, StudioTemplatePropertyType} from "../../../common/studio/studio-model";

export const blankComponentParams: StudioTemplateProperty[] = [
  {
    caption: "Component class name",
    code: "componentName",
    propertyType: StudioTemplatePropertyType.POLYMER_COMPONENT_NAME,
    required: true
  }
];