import {Entity, EntityAttribute, getEntitiesArray, ProjectModel} from "./model/cuba-model";
import * as path from "path";
import {ProjectEntityInfo} from "./model/entities-generation";
import {EnumDeclaration} from "typescript";
import {createEnums} from "./model/enums-generation";

/**
 * @param {string} elementName my-app-custom
 * @returns {string} class name MyAppCustom
 */
export const elementNameToClass = (elementName: string): string => {
  if (elementName == null) {
    return elementName;
  }
  return elementName
    .split('-')
    .map(capitalizeFirst)
    .join('');
};

export const capitalizeFirst = (part: string) => part[0].toUpperCase() + part.slice(1);

export const unCapitalizeFirst = (part: string) => part[0].toLowerCase() + part.slice(1);

export function convertToUnixPath(input: string): string {
  const isExtendedLengthPath = /^\\\\\?\\/.test(input);
  const hasNonAscii = /[^\u0000-\u0080]+/.test(input); // eslint-disable-line no-control-regex

  if (isExtendedLengthPath || hasNonAscii) {
    return input;
  }

  return input.replace(/\\/g, '/');
}

/**
 * Convert java class fully qualified name to compilable TS class name
 * @param fqn java class fqn
 */
export function fqnToName(fqn: string): string {
  return fqn.replace(/\./g, '_');
}

export function getEntityModulePath(entity: Entity, prefix: string = ''): string {
  const modulePath = entity.name ? entity.name : entity.className;
  return path.join(prefix, modulePath);
}

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

//todo add assert in integration test with inheritor attrs (sec$User)
export function collectAttributesFromHierarchy(entity: Entity, projectModel: ProjectModel): EntityAttribute[] {
  let attrs: EntityAttribute[] = entity.attributes;

  const allEntities: Partial<Entity>[] = ([] as Partial<Entity>[])
    .concat(projectModel.entities)
    .concat(projectModel.baseProjectEntities ? projectModel.baseProjectEntities : []);

  let {parentClassName, parentPackage} = entity;

  while (parentClassName && parentPackage && parentClassName.length > 0 && parentPackage.length > 0) {
    const parentFqn = `${parentPackage}.${parentClassName}`;
    const parent = allEntities.find(e => e.fqn === parentFqn);
    if (parent) {
      attrs = parent.attributes ? attrs.concat(parent.attributes) : attrs;
      parentPackage = parent.parentPackage ? parent.parentPackage : '';
      parentClassName = parent.parentClassName ? parent.parentClassName : '';
    } else {
      parentPackage = '';
      parentClassName = '';
    }
  }

  return attrs;
}