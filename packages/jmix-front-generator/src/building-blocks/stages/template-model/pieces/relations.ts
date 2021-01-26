import {
  EditRelations,
  EditRelationsSplit,
  RelationImport
} from "../../../../generators/react-typescript/entity-management/template-model";
import {getEntityPath} from "../../../../generators/react-typescript/common/template-model";
import { EntityWithPath } from "./entity";
import {EntityAttribute, ProjectModel} from "../../../../common/model/cuba-model";
import {findEntity} from "../../../../common/model/cuba-model-utils";

// Moved (almost) unchanged from src/common

export function getRelationImports(relations: EditRelations, entity: EntityWithPath): RelationImport[] {
  const entities: EntityWithPath[] = Object.values(relations);
  entities.unshift(entity);
  return entities
    // todo - need to think about className collision here (same className with different path)
    .reduce( // remove identical Imports (className and path both match)
      (acc, relationImport) => {
        if (!acc.some(ri => ri.className == relationImport.className && ri.path == relationImport.path)) {
          acc.push(relationImport);
        }
        return acc;
      } , [] as RelationImport[])
}

export function getRelations(projectModel: ProjectModel, attributes: EntityAttribute[]): EditRelationsSplit {
  return attributes.reduce<EditRelationsSplit>((relations, attribute) => {
    if (attribute.type == null || (attribute.mappingType !== 'ASSOCIATION' && attribute.mappingType !== 'COMPOSITION')) {
      return relations;
    }
    const entity = findEntity(projectModel, attribute.type.entityName!);
    if (entity) {
      const entityWithPath = {
        ...entity,
        path: getEntityPath(entity, projectModel)
      };
      if (attribute.mappingType === 'ASSOCIATION') {
        relations.editAssociations[attribute.name] = entityWithPath;
      }
      if (attribute.mappingType === 'COMPOSITION') {
        relations.editCompositions[attribute.name] = entityWithPath;
      }
    }
    return relations;
  }, {editAssociations: {}, editCompositions: {}});
}