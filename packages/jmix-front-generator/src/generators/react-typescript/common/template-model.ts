import {Entity, ProjectModel} from "../../../common/model/cuba-model";
import {isBaseProjectEntity} from "../../../common/model/cuba-model-utils";

/**
 * @deprecated
 */
export interface EntityTemplateModel extends  Entity{
  path: string // path relative to SDK placement
}

/**
 * @deprecated
 */
export interface CommonTemplateModel {
  componentName: string;
  className: string;
  relDirShift: string;
}

export function getEntityPath(entity: Entity, projectModel: ProjectModel): string {
  if (isBaseProjectEntity(entity, projectModel)) {
    return `cuba/entities/base/${entity.name}`;
  }
  return `cuba/entities/${entity.name}`;
}