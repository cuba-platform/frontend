import {RestServiceMethodModel, StudioTemplateProperty, StudioTemplatePropertyType} from "../../../common/cuba-studio";

export const serviceFormParams: StudioTemplateProperty[] = [
  {
    caption: "Service method",
    code: "serviceMethod",
    propertyType: StudioTemplatePropertyType.REST_SERVICE_METHOD,
    required: true
  },
  {
    caption: "Component name",
    code: "componentName",
    propertyType: StudioTemplatePropertyType.POLYMER_COMPONENT_NAME,
    defaultValue: "-form",
    required: true
  }
];

export interface ServiceFormAnswers {
  componentName: string;
  serviceMethod: RestServiceMethodModel;
}