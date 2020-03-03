import {EntityInfo, StudioTemplateProperty, StudioTemplatePropertyType, ViewInfo} from "./studio/studio-model";
import {Answers, Question as YeomanQuestion} from "yeoman-generator";
import {getEntitiesArray, ProjectModel} from './model/cuba-model';
import {findViewsForEntity} from './model/cuba-model-utils';

export type ObjectChoice = {name: string, value: any, short?: string};
export type Choice = string | ObjectChoice;

interface Question extends YeomanQuestion {
  choices?: Choice[] | ((previousAnswers: Answers) => Choice[]), // Property is missing in yeoman typings
  source?: (answers: Answers, input: string) => Promise<Choice[]>, // Added by autocomplete plugin
}

export const enum QuestionType {
  input = 'input',
  confirm = 'confirm',
  list = 'list',
  rawlist = 'rawlist',
  expand = 'expand',
  checkbox = 'checkbox',
  password = 'password',
  editor = 'editor',
  autocomplete = 'autocomplete'
}


const matching: {[key: string]: QuestionType} = {
  [StudioTemplatePropertyType.BOOLEAN]: QuestionType.confirm,
  [StudioTemplatePropertyType.ENTITY]: QuestionType.autocomplete,
  [StudioTemplatePropertyType.VIEW]: QuestionType.autocomplete,
  [StudioTemplatePropertyType.NESTED_ENTITY_VIEW]: QuestionType.autocomplete,
  [StudioTemplatePropertyType.STRING]: QuestionType.input,
  [StudioTemplatePropertyType.INTEGER]: QuestionType.input,
  [StudioTemplatePropertyType.OPTION]: QuestionType.autocomplete,
  [StudioTemplatePropertyType.MULTI_OPTION]: QuestionType.list,
  [StudioTemplatePropertyType.REST_QUERY]: QuestionType.list,
  [StudioTemplatePropertyType.REST_SERVICE_METHOD]: QuestionType.list,
  [StudioTemplatePropertyType.POLYMER_COMPONENT_NAME]: QuestionType.input
};

export function fromStudioProperty(prop: StudioTemplateProperty, projectModel?: ProjectModel): Question {
  const question: Question = {
    type: matching[prop.propertyType] || QuestionType.input,
    name: prop.code,
    message: prop.caption
  };

  switch (prop.propertyType) {
    case StudioTemplatePropertyType.ENTITY:
      if (!projectModel) {
        throw new Error('Project model is required to determine choices for property of type ' + StudioTemplatePropertyType.ENTITY);
      }
      question.choices = getEntitiesArray(projectModel.entities)
        .filter(entity => entity.name)
        .map(entity => {
          const entityInfo: EntityInfo = {
            name: entity.name!
          };
          return {
            name: entity.name!,
            value: entityInfo
          };
        });
      break;
    case StudioTemplatePropertyType.VIEW:
      if (!projectModel) {
        throw new Error('Project model is required to determine choices for property of type ' + StudioTemplatePropertyType.VIEW);
      }
      question.choices = (previousAnswers) => {
        return findViewsForEntity(projectModel, previousAnswers.entity.name)
          .map(view => ({
            name: view.name,
            value: view
          }));
      };
      break;
    case StudioTemplatePropertyType.NESTED_ENTITY_VIEW:
      if (!projectModel) {
        throw new Error('Project model is required to determine choices for property of type ' + StudioTemplatePropertyType.NESTED_ENTITY_VIEW);
      }
      if (!prop.options) {
        throw new Error('Property name and entity name are required to determine choices for property of type ' + StudioTemplatePropertyType.NESTED_ENTITY_VIEW);
      }
      const propertyName = prop.options[0];
      const entityName = prop.options[1];
      question.choices = findViewsForEntity(projectModel, entityName)
        .map(view => ({
          name: view.name,
          value: {[propertyName]: view.name}
        }));
      break;
    case StudioTemplatePropertyType.OPTION:
      if (!prop.options) {
        throw new Error('Options are missing');
      }
      question.choices = prop.options;
      break;
  }

  if (question.type === QuestionType.autocomplete) {
    if (!question.choices) {
      throw new Error('Question choices are not defined');
    }

    question.source = (answers, input) => {
      let choices: Choice[];
      if (typeof(question.choices) === 'function') {
        choices = question.choices(answers);
      } else {
        choices = [ ...question.choices! ];
      }

      if (input) {
        return Promise.resolve(choices.filter(choice => {
          if (typeof(choice) === 'string') {
            return choice.indexOf(input) > -1;
          } else {
            return choice.name.indexOf(input) > -1;
          }
        }));
      } else {
        return Promise.resolve(choices);
      }
    };
  }

  return question;
}

export function fromStudioProperties(props: StudioTemplateProperty[], projectModel?: ProjectModel): Question[] {
  return props.map(prop => fromStudioProperty(prop, projectModel));
}
