import {EntityAttribute, ProjectModel} from "../../../../../common/model/cuba-model";
import {isStringIdEntity} from "../../../../../generators/react-typescript/common/entity";
import {collectAttributesFromHierarchy} from "../../../../../common/model/cuba-model-utils";
import {EntityWithPath} from "../entity";

export interface StringIdAnswers {
  entity: EntityWithPath;
  listShowIdAttr?: boolean;
  listIdAttrPos?: number;
  editIdAttrPos?: number;
  idAttrName?: string; // Will be asked for if not found in project model
}

// Moved (almost) unchanged from src/common

export function deriveStringIdAnswers<
  A extends StringIdAnswers,
  E extends EntityAttribute[] | undefined,
  R = E extends EntityAttribute[] ? EntityAttribute[] : undefined
  >(
  answers: A,
  projectModel: ProjectModel,
  listAttributesArg: EntityAttribute[],
  editAttributesArg?: E,
): {
  stringIdName?: string,
  listAttributes: EntityAttribute[],
  editAttributes: R,
} {

  const listAttributes = listAttributesArg.slice();
  const editAttributes = editAttributesArg?.slice();

  if (!isStringIdEntity(projectModel, answers.entity)) {
    return {
      listAttributes,
      editAttributes: editAttributes as unknown as R
    };
  }

  const stringIdName = answers.entity.idAttributeName ?? answers.idAttrName;
  if (stringIdName == null) {
    throw new Error('Could not find the stringIdName');
  }
  const allEntityAttributes = collectAttributesFromHierarchy(answers.entity, projectModel);
  const idAttr = allEntityAttributes.find(attr => attr.name === stringIdName);
  if (idAttr == null) {
    throw new Error(`Unable to find ID attribute. Expected the ID attribute to be named "${stringIdName}".`);
  }
  if (editAttributes != null && stringIdName !== 'id') {
    const impostorAttrIndex = editAttributes.findIndex(attr => attr.name === 'id');
    if (impostorAttrIndex !== -1) {
      // An edge case when we have a non-ID string attribute named "id", and a differently named ID attribute.
      // We do not show the attribute named "id" in the editor.
      // We still show it in the List Component (it will display the same value as the real ID attribute).
      editAttributes.splice(impostorAttrIndex, 1);
    }
  }
  if (editAttributes != null && answers.editIdAttrPos != null) {
    editAttributes.splice(answers.editIdAttrPos, 0, idAttr);
  }
  if (answers.listShowIdAttr && answers.listIdAttrPos != null) {
    listAttributes.splice(answers.listIdAttrPos, 0, idAttr);
  }

  return {
    stringIdName,
    listAttributes,
    editAttributes: editAttributes as unknown as R
  };
}
