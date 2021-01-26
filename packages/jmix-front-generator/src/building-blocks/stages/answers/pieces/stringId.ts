import {StudioTemplateProperty, StudioTemplatePropertyType} from "../../../../common/studio/studio-model";
import {Entity, ProjectModel} from "../../../../common/model/cuba-model";
import {YeomanGenerator} from "../../../YeomanGenerator";
import {fromStudioProperties} from "../../../../common/questions";

export interface StringIdAnswers {
  listShowIdAttr?: boolean;
  listIdAttrPos?: number;
  editIdAttrPos?: number;
  idAttrName?: string;
}

// The view in the exported project model never contains the ID attribute.
// Therefore we are asking whether the ID attribute shall be shown in the List component.
// For StringId entities we always show the ID field in the Edit component
// as it is required to create the entities.
export const questionShowIdInList: StudioTemplateProperty = {
  code: 'listShowIdAttr',
  caption: 'Show ID attribute in the List component?',
  propertyType: StudioTemplatePropertyType.BOOLEAN,
  required: true
};

export const questionIdPositionInList: StudioTemplateProperty = {
  code: 'listIdAttrPos',
  caption: 'Position of the ID attribute in the List component \n' +
    '(behaves like an array index, e.g. enter 0 for the ID to appear as the first row/column, \n' +
    '-1 for next-to-last, etc.).',
  propertyType: StudioTemplatePropertyType.INTEGER,
  required: true
};

export const questionIdPositionInEdit: StudioTemplateProperty = {
  code: 'editIdAttrPos',
  caption: 'Position of the ID attribute in the Edit component \n' +
    '(behaves like an array index, e.g. enter 0 for the ID to appear as the first field of the form, \n' +
    '-1 for next-to-last, etc.).',
  propertyType: StudioTemplatePropertyType.INTEGER,
  required: true
};

export const questionIdAttrName = {
  code: 'idAttrName',
  caption: 'You have chosen a String ID entity, but we could not find the ID attribute name in the project model. \n' +
    'What is the ID attribute name?',
  propertyType: StudioTemplatePropertyType.STRING,
  required: true
};

export const stringIdQuestions = [
  questionShowIdInList,
  questionIdPositionInList,
  questionIdPositionInEdit,
  questionIdAttrName
];

/**
 * Pass false as editIdPositionQuestion to disable asking this question
 */
export interface StringIdQuestions {
  idAttrNameQuestion?: StudioTemplateProperty;
  listShowIdQuestion?: StudioTemplateProperty;
  listIdPositionQuestion?: StudioTemplateProperty;
  editIdPositionQuestion?: StudioTemplateProperty | false;
}

export async function askStringIdQuestions(
  entity: Entity,
  projectModel: ProjectModel,
  gen: YeomanGenerator,
  questions: StringIdQuestions = {}
): Promise<StringIdAnswers> {
  const {
    idAttrNameQuestion = questionIdAttrName,
    listShowIdQuestion = questionShowIdInList,
    listIdPositionQuestion = questionIdPositionInList,
    editIdPositionQuestion = questionIdPositionInEdit
  } = questions;

  let stringIdAnswers = {};

  let idAttrNameAnswers = {};
  if (entity.idAttributeName == null) {
    // Seems that the project model was created with an older version of Studio.
    // Ask for ID attribute name.
    idAttrNameAnswers = await gen.prompt(fromStudioProperties(
      [idAttrNameQuestion], projectModel
    ));
  }

  // Ask whether to show the ID field in the List component
  const showIdAnswers = await gen.prompt(fromStudioProperties(
    [listShowIdQuestion], projectModel
  ));

  // Ask at which position to show the ID field in the List and Edit components
  const idPositionQuestions = [];
  if (showIdAnswers.listShowIdAttr) {
    idPositionQuestions.push(listIdPositionQuestion);
  }
  if (editIdPositionQuestion !== false) {
    idPositionQuestions.push(editIdPositionQuestion);
  }
  let idPositionAnswers = {};
  if (idPositionQuestions.length > 0) {
    idPositionAnswers = await gen.prompt(fromStudioProperties(
      idPositionQuestions,
      projectModel
    ));
  }

  return {...idAttrNameAnswers, ...showIdAnswers, ...idPositionAnswers};
}
