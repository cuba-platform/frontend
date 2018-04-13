import {RestServiceMethodModel, StudioTemplateProperty, StudioTemplatePropertyType} from "../../../common/cuba-studio";

export const serviceDataParams: StudioTemplateProperty[] = [
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
    defaultValue: "-data",
    required: true
  }
];

export interface ServiceDataAnswers {
  componentName: string;
  serviceMethod: RestServiceMethodModel;
}