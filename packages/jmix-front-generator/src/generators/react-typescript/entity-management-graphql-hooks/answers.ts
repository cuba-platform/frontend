import {CommonGenerationOptions} from "../../../common/cli-options";
import {ProjectModel} from "../../../common/model/cuba-model";
import {YeomanGenerator} from "../../../building-blocks/YeomanGenerator";
import {askQuestions} from "../../../building-blocks/stages/answers/defaultGetAnswersFromPrompt";
import {isStringIdEntity} from "../common/entity";
import {askStringIdQuestions, stringIdQuestions} from "../../../building-blocks/stages/answers/pieces/stringId";
import {StudioTemplateProperty} from "../../../common/studio/studio-model";
import {EntityWithPath} from "../../../building-blocks/stages/template-model/pieces/entity";
import {ListTypes} from "../../../building-blocks/stages/template-model/pieces/entity-management/list-types";
import {commonEntityManagementQuestions, displayAttributesQuestions} from "../../../building-blocks/stages/answers/pieces/entity-management/entity-management-common";

export type Answers = {
  entity: EntityWithPath;
  managementComponentName: string;
  listType: ListTypes;
  listComponentName: string;
  listAttributes: string;
  editComponentName: string;
  editAttributes: string;
  nestedEntityInfo?: Record<string, string>;
  idAttrName?: string;
}

export const allQuestions: StudioTemplateProperty[] = [
  ...commonEntityManagementQuestions,
  ...displayAttributesQuestions,
  ...stringIdQuestions
];

export const getAnswersFromPrompt = async (
  projectModel: ProjectModel, gen: YeomanGenerator, options: CommonGenerationOptions
): Promise<Answers> => {

  const initialQuestions = [
    ...commonEntityManagementQuestions,
    ...displayAttributesQuestions
  ];

  let answers = await askQuestions<Answers>(initialQuestions, projectModel, gen);

  // TODO Need different implementation for GraphQL entity-management
  // if (isStringIdEntity(projectModel, answers.entity)) {
  //   answers = {
  //     ...answers,
  //     ...await askStringIdQuestions(answers.entity, projectModel, gen)
  //   }
  // }

  return answers;
}
