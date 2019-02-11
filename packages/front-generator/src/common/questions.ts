import {StudioTemplateProperty, StudioTemplatePropertyType} from "./studio/studio-model";
import {Question} from "yeoman-generator";

export const enum QuestionType {
  input = 'input',
  confirm = 'confirm',
  list = 'list',
  rawlist = 'rawlist',
  expand = 'expand',
  checkbox = 'checkbox',
  password = 'password',
  editor = 'editor'
}


const matching: {[key: string]: QuestionType} = {
  [StudioTemplatePropertyType.BOOLEAN]: QuestionType.confirm,
  [StudioTemplatePropertyType.ENTITY]: QuestionType.list,
  [StudioTemplatePropertyType.VIEW]: QuestionType.list,
  [StudioTemplatePropertyType.STRING]: QuestionType.input,
  [StudioTemplatePropertyType.INTEGER]: QuestionType.input,
  [StudioTemplatePropertyType.OPTION]: QuestionType.list,
  [StudioTemplatePropertyType.MULTI_OPTION]: QuestionType.list,
  [StudioTemplatePropertyType.REST_QUERY]: QuestionType.list,
  [StudioTemplatePropertyType.REST_SERVICE_METHOD]: QuestionType.list,
  [StudioTemplatePropertyType.POLYMER_COMPONENT_NAME]: QuestionType.input
};

export function fromStudioProperty(prop: StudioTemplateProperty): Question {
  return {
    type: matching[prop.propertyType] || QuestionType.input,
    name: prop.code,
    message: prop.caption
  };
}

export function fromStudioProperties(props: StudioTemplateProperty[]): Question[] {
  return props.map(prop => fromStudioProperty(prop));
}