import {CommonTemplateModel} from "../../../building-blocks/stages/template-model/pieces/common";
import {EntityAttribute, ProjectModel} from "../../../common/model/cuba-model";
import {EditRelations, RelationImport} from "../entity-management/template-model";
import {ListTypes} from "../../../building-blocks/stages/template-model/pieces/entity-management/list-types";
import {YeomanGenerator} from "../../../building-blocks/YeomanGenerator";
import {Answers} from "./answers";
import {Options} from "./options";
import {
  deriveEntityManagementCommon,
  EntityManagementCommonTemplateModel
} from "../../../building-blocks/stages/template-model/pieces/entity-management/common";
import {
  deriveEditAttributesFromStringAnswer,
  EditAttributesTemplateModel
} from "../../../building-blocks/stages/template-model/pieces/entity-management/edit-attributes";
import {
  deriveListAttributesFromStringAnswer,
  ListAttributesTemplateModel
} from "../../../building-blocks/stages/template-model/pieces/entity-browser/browser";
import {deriveEditorTemplateModel} from "../../../building-blocks/stages/template-model/pieces/entity-management/editor";
import {
  deriveEntity,
  EntityTemplateModel,
  EntityWithPath
} from "../../../building-blocks/stages/template-model/pieces/entity";

export type TemplateModel = CommonTemplateModel & {
  listComponentClass: string;
  editComponentClass: string;
  listType: ListTypes;
  nameLiteral: string;
  entity: EntityWithPath;
  listAttributes: EntityAttribute[];
  stringIdName?: string;
  editAttributes: EntityAttribute[];
  readOnlyFields: string[];
  editCompositions: EditRelations;
  editAssociations: EditRelations;
  nestedEntityInfo?: Record<string, string>;
  relationImports: RelationImport[];
};

export const deriveTemplateModel = (
  answers: Answers, projectModel: ProjectModel, gen: YeomanGenerator, options: Options
): TemplateModel => {

  type PartialModel =
    & EntityTemplateModel
    & EntityManagementCommonTemplateModel<ListTypes>
    & ListAttributesTemplateModel
    & EditAttributesTemplateModel;

  const partialModel: PartialModel = {
    ...deriveEntity(answers, projectModel),
    ...deriveEntityManagementCommon(options, answers),
    ...deriveListAttributesFromStringAnswer(answers, projectModel),
    ...deriveEditAttributesFromStringAnswer(answers, projectModel)
  };

  const {listAttributes, editAttributes, entity: entityWithPath} = partialModel;

  return {
    ...partialModel,
    // ...deriveStringIdAnswers(answers, projectModel, listAttributes, editAttributes), // TODO A different implementation is needed for GraphQL
    ...deriveEditorTemplateModel(answers, projectModel, editAttributes, entityWithPath)
  };
};
