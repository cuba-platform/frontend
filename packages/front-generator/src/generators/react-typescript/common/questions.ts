import {StudioTemplatePropertyType} from '../../../common/studio/studio-model';

export const idAttrNameQuestions = [
  {
    code: 'idAttrName',
    caption: 'You have chosen a String ID entity, but we could not find the ID attribute name in the project model. \n' +
      'What is the ID attribute name?',
    propertyType: StudioTemplatePropertyType.STRING,
    required: true
  }
];
