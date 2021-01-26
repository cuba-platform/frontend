import {
  EditRelations,
  RelationImport
} from "../../../../../generators/react-typescript/entity-management/template-model";
import {EntityAttribute, ProjectModel} from "../../../../../common/model/cuba-model";
import {EntityWithPath} from "../entity";
import {getRelationImports, getRelations} from "../relations";

export type EntityEditorTemplateModel = {
  readOnlyFields: string[];
  editCompositions: EditRelations;
  editAssociations: EditRelations;
  nestedEntityInfo?: Record<string, string>;
  relationImports: RelationImport[];
};

export type EntityEditorAnswers = {
  entity: EntityWithPath;
  nestedEntityInfo?: Record<string, string>;
};

/**
 * Derives template model that is common for editors (does not include edit attributes as there are multiple ways
 * of obtaining them depending on whether we use REST or GraphQL).
 *
 * @param answers
 * @param projectModel
 * @param editAttributes
 * @param entityWithPath
 */
export function deriveEditorTemplateModel(
  answers: EntityEditorAnswers, projectModel: ProjectModel, editAttributes: EntityAttribute[], entityWithPath: EntityWithPath
): EntityEditorTemplateModel {
  const readOnlyFields = editAttributes
    .filter((attr: EntityAttribute) => attr.readOnly)
    .map((attr: EntityAttribute) => attr.name);

  const { editAssociations, editCompositions } = getRelations(projectModel, editAttributes);

  const nestedEntityInfo = answers.nestedEntityInfo;

  const relationImports = getRelationImports(editAssociations, entityWithPath);

  return {
    readOnlyFields,
    editAssociations,
    editCompositions,
    nestedEntityInfo,
    relationImports
  };
}