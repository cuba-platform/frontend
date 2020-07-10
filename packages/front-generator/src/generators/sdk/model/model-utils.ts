import {ProjectEntityInfo} from "./entities-generation";
import {EnumDeclaration} from "typescript";
import {Entity, getEntitiesArray, ProjectModel} from "../../../common/model/cuba-model";
import {createEnums} from "./enums-generation";

export type ModelContext = {
  entitiesMap: Map<string, ProjectEntityInfo>
  enumsMap: Map<string, EnumDeclaration>
}

/**
 * @param projectModel model context collected from
 * @return entity and enum map with fqn as key
 */
export function collectModelContext(projectModel: ProjectModel) {
  const entities: Entity[] = getEntitiesArray(projectModel.entities);
  const baseProjectEntities: Entity[] = getEntitiesArray(projectModel.baseProjectEntities);

  const entitiesMap = new Map<string, ProjectEntityInfo>();
  const enumsMap = new Map<string, EnumDeclaration>();
  createEnums(projectModel.enums).forEach(en => enumsMap.set(en.fqn, en.node));

  const addEntityToMap = (map: Map<string, ProjectEntityInfo>, isBaseProjectEntity = false) => (e: Entity) => {
    map.set(e.fqn, {
      isBaseProjectEntity,
      entity: e
    })
  };

  entities.forEach(addEntityToMap(entitiesMap));
  baseProjectEntities.forEach(addEntityToMap(entitiesMap, true));
  return {entitiesMap, enumsMap}
}

export function findEntityByName(entityName: string, ctx: ModelContext): ProjectEntityInfo | undefined {
  return [...ctx.entitiesMap.values()]
    .find(entityInfo => entityInfo.entity.name === entityName);
}

