import {Cardinality, Entity, EntityAttribute, getEntitiesArray, MappingType, ProjectModel} from "./cuba-model";
import * as Generator from "yeoman-generator";
import * as path from "path";
import * as ts from "typescript";
import {EnumDeclaration} from "typescript";
import {renderTSNodes} from "./ts-helpers";
import {createEntityViewTypes} from "./entity-views-generation";
import {createEnums} from "./enums-generation";
import {createIncludes, entityImportInfo, getEntityModuleName, ImportInfo} from "./import-utils";

const ENTITIES_DIR = 'entities';
export const BASE_ENTITIES_DIR = 'base';
const ENUMS_DIR = 'enums';
const ENUMS_FILE = 'enums';

export interface ProjectEntityInfo {
  entity: Entity;
  isBaseProjectEntity: boolean;
}

export type ClassCreationContext = {
  entity: Entity
  entitiesMap: Map<string, ProjectEntityInfo>
  enumsMap: Map<string, EnumDeclaration>
  isBaseProjectEntity: boolean
}

export function generateEntities(projectModel: ProjectModel, destDir: string, fs: Generator.MemFsEditor): void {
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

  for (const [, entityInfo] of entitiesMap) {
    const {entity} = entityInfo;
    const ctx: ClassCreationContext = {
      entitiesMap, entity, enumsMap, isBaseProjectEntity: entityInfo.isBaseProjectEntity
    };

    const {importInfos, classDeclaration} = createEntityClass(ctx);
    const includes = createIncludes(importInfos);

    const views = createEntityViewTypes(entity, projectModel);
    fs.write(
      path.join(destDir, !entityInfo.isBaseProjectEntity ? ENTITIES_DIR : path.join(ENTITIES_DIR, BASE_ENTITIES_DIR), getEntityModuleName(entity) + '.ts'),
      renderTSNodes([...includes, classDeclaration, ...views])
    )
  }

  fs.write(
    path.join(destDir, ENUMS_DIR, path.join(ENUMS_FILE + '.ts')),
    renderTSNodes([...enumsMap.values()], '\n\n')
  )
}

export function createEntityClass(ctx: ClassCreationContext): {
  classDeclaration: ts.ClassDeclaration,
  importInfos: ImportInfo[]
} {

  const heritageInfo = createEntityClassHeritage(ctx);
  const importInfos: ImportInfo[] = [];
  if (heritageInfo.parentEntity) {
    importInfos.push(entityImportInfo(heritageInfo.parentEntity, ctx.isBaseProjectEntity))
  }

  const classMembersInfo = createEntityClassMembers(ctx);
  if (classMembersInfo.importInfos) {
    importInfos.push(...classMembersInfo.importInfos);
  }

  return {
    classDeclaration: ts.createClassDeclaration(
      undefined,
      [
        ts.createToken(ts.SyntaxKind.ExportKeyword)
      ],
      ctx.entity.className,
      undefined,
      heritageInfo.heritageClauses,
      classMembersInfo.classMembers
    ),
    importInfos
  };
}

function createEntityClassHeritage(ctx: ClassCreationContext): {
  heritageClauses: ts.HeritageClause[]
  parentEntity?: ProjectEntityInfo
} {

  const {entity, entitiesMap} = ctx;

  if (!entity.parentClassName || !entity.parentPackage) {
    return {heritageClauses: []};
  }

  if (entity.parentClassName === 'AbstractSearchFolder') { // todo AbstractSearchFolder does not have name (?)
    return {heritageClauses: []};
  }

  const parentEntityInfo = entitiesMap.get(entity.parentPackage + '.' + entity.parentClassName);
  if (!parentEntityInfo) {
    return {heritageClauses: []};
  }

  return {
    heritageClauses: [ts.createHeritageClause(
      ts.SyntaxKind.ExtendsKeyword,
      [
        ts.createExpressionWithTypeArguments(
          [],
          ts.createIdentifier(entity.parentClassName),
        )
      ]
    )],
    parentEntity: parentEntityInfo
  };
}

function createEntityClassMembers(ctx: ClassCreationContext): {
  classMembers: ts.ClassElement[]
  importInfos: ImportInfo[]
} {

  const {entity} = ctx;

  const basicClassMembers = entity.name != null
    ? [
      ts.createProperty(
        undefined,
        [ts.createToken(ts.SyntaxKind.StaticKeyword)],
        'NAME',
        undefined,
        undefined,
        ts.createLiteral(entity.name)
      )
    ]
    : [];

  if (!entity.attributes) {
    return {classMembers: basicClassMembers, importInfos: []};
  }

  const importInfos: ImportInfo[] = [];

  const allClassMembers = [...basicClassMembers, ...entity.attributes.map(entityAttr => {
    const attributeTypeInfo = createAttributeType(entityAttr, ctx);
    if (attributeTypeInfo.importInfo) importInfos.push(attributeTypeInfo.importInfo);

    return ts.createProperty(
      undefined,
      undefined,
      entityAttr.name,
      ts.createToken(ts.SyntaxKind.QuestionToken),
      ts.createUnionTypeNode([
        attributeTypeInfo.node,
        ts.createKeywordTypeNode(ts.SyntaxKind.NullKeyword)
      ]),
      undefined
    );

  })];

  return {classMembers: allClassMembers, importInfos}
}

function createAttributeType(entityAttr: EntityAttribute, ctx: ClassCreationContext): {
  node: ts.TypeNode
  importInfo: ImportInfo | undefined
} {

  let node: ts.TypeNode | undefined;
  let refEntity: ProjectEntityInfo | undefined;
  let enumDeclaration: EnumDeclaration | undefined;

  const {mappingType} = entityAttr;

  // primitive

  if (mappingType === MappingType.DATATYPE) {
    switch (entityAttr.type.fqn) {
      case 'java.lang.Boolean':
        node = ts.createKeywordTypeNode(ts.SyntaxKind.BooleanKeyword);
        break;
      case 'java.lang.Integer':
        node = ts.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword);
        break;
      case 'java.lang.String':
        node = ts.createKeywordTypeNode(ts.SyntaxKind.StringKeyword);
        break;
      default:
        node = ts.createKeywordTypeNode(ts.SyntaxKind.AnyKeyword);
        break;
    }
  }

  //objects

  if (mappingType === MappingType.ASSOCIATION || mappingType === MappingType.COMPOSITION) {
    refEntity = ctx.entitiesMap.get(entityAttr.type.fqn);

    if (refEntity) {
      switch (entityAttr.cardinality) {
        case Cardinality.MANY_TO_MANY:
        case Cardinality.ONE_TO_MANY:
          node = ts.createArrayTypeNode(
            ts.createTypeReferenceNode(entityAttr.type.className, undefined)
          );
          break;
        case Cardinality.ONE_TO_ONE:
        case Cardinality.MANY_TO_ONE:
        default:
          node = ts.createTypeReferenceNode(entityAttr.type.className, undefined);
          break;
      }
    }
  }

  //enums

  if (mappingType == MappingType.ENUM) {
    enumDeclaration = ctx.enumsMap.get(entityAttr.type.fqn);
    if (enumDeclaration) {
      node = ts.createTypeReferenceNode(enumDeclaration.name, undefined);
    }
  }

  if (!node) {
    node = ts.createKeywordTypeNode(ts.SyntaxKind.AnyKeyword);
  }

  let importInfo = undefined;

  if (refEntity && refEntity.entity && refEntity.entity.name != ctx.entity.name) importInfo = entityImportInfo(refEntity, ctx.isBaseProjectEntity);

  if (enumDeclaration) {
    importInfo = {
      className: enumDeclaration.name.text,
      importPath: ctx.isBaseProjectEntity ? path.join('..', '..', ENUMS_DIR, ENUMS_FILE) : path.join('..', ENUMS_DIR, ENUMS_FILE)
    };
  }

  return {
    node,
    importInfo
  };
}

