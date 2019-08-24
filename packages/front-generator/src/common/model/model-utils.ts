import * as ts from "typescript";
import {EnumDeclaration, ParameterDeclaration, StringLiteral} from "typescript";
import {ProjectEntityInfo} from "./entities-generation";
import {Entity, getEntitiesArray, ProjectModel} from "./cuba-model";
import {createEnums} from "./enums-generation";

export type ModelContext = {
  entitiesMap: Map<string, ProjectEntityInfo>
  enumsMap: Map<string, EnumDeclaration>
}

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

export function param(name: string, typeName: string): ParameterDeclaration {
  const paramType = ts.createTypeReferenceNode(typeName, undefined);
  return ts.createParameter(undefined, undefined, undefined, name, undefined, paramType);
}

export function str(text: string): StringLiteral {
  return ts.createStringLiteral(text);
}

export function exportModifier() {
  return ts.createToken(ts.SyntaxKind.ExportKeyword);
}
