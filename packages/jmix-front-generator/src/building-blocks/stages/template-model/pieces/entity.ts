import {Entity, ProjectModel} from "../../../../common/model/cuba-model";
import {getEntityPath} from "../../../../generators/react-typescript/common/template-model";

export interface EntityWithPath extends Entity {
  path: string // path relative to SDK placement
}

export interface EntityTemplateModel {
  entity: EntityWithPath;
}

export interface EntityAnswers {
  entity: Entity
}

export function deriveEntity(
  answers: EntityAnswers, projectModel: ProjectModel
): EntityTemplateModel {
  const entity = answers.entity;

  const entityWithPath = {
    entity: {
      ...entity,
      path: getEntityPath(entity, projectModel)
    }
  };

  return entityWithPath;
}