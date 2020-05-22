import {StudioTemplateProperty, StudioTemplatePropertyType} from "../../../common/studio/studio-model";
import {StudioProjectInfo} from "../../../common/studio/studio-integration";

export const appGeneratorParams: StudioTemplateProperty[] = [
  {
    code: 'restClientId',
    caption: 'Rest client id',
    propertyType: StudioTemplatePropertyType.STRING,
    defaultValue: 'client',
    required: true
  },

  {
    code: 'restClientSecret',
    caption: 'Rest client secret',
    propertyType: StudioTemplatePropertyType.STRING,
    defaultValue: 'secret',
    required: true
  },
];


export interface AppAnswers {
  projectInfo: StudioProjectInfo;
  restClientId: string;
  restClientSecret: string;
}
