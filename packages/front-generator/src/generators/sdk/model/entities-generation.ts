import {Entity, EntityAttribute, ProjectModel} from "../../../common/model/cuba-model";
import * as Generator from "yeoman-generator";
import * as path from "path";
import * as ts from "typescript";
import {EnumDeclaration} from "typescript";
import {renderTSNodes} from "../../../common/ts-helpers";
import {createEntityViewTypes} from "./entity-views-generation";
import {createIncludes, entityImportInfo, enumImportInfo, ImportInfo} from "../import-utils";
import {BASE_ENTITIES_DIR, ENTITIES_DIR, ENUMS_DIR, ENUMS_FILE} from "../../../common/constants";
import {getEntityModulePath} from "../../../common/utils";
import {collectModelContext, ModelContext} from "./model-utils";

export interface ProjectEntityInfo {
  entity: Entity;
  isBaseProjectEntity: boolean;
}

export type ClassCreationContext = ModelContext & {
  entity: Entity
  isBaseProjectEntity: boolean
}


export function generateEntities(projectModel: ProjectModel, destDir: string, fs: Generator.MemFsEditor): ModelContext {
  const {entitiesMap, enumsMap} = collectModelContext(projectModel);
  for (const [, entityInfo] of entitiesMap) {
    const {entity} = entityInfo;
    const ctx: ClassCreationContext = {
      entitiesMap, entity, enumsMap, isBaseProjectEntity: entityInfo.isBaseProjectEntity
    };

    const {importInfos, classDeclaration} = createEntityClass(ctx);
    const includes = createIncludes(importInfos, createImportInfo(entityInfo, ctx.isBaseProjectEntity));

    const views = createEntityViewTypes(entity, projectModel);

    const entityPath = !entityInfo.isBaseProjectEntity ? ENTITIES_DIR : path.posix.join(ENTITIES_DIR, BASE_ENTITIES_DIR);
    fs.write(
      path.posix.join(destDir, entityPath, getEntityModulePath(entity) + '.ts'),
      renderTSNodes([...includes, classDeclaration, ...views])
    )
  }

  if (enumsMap.size > 0) fs.write(
    path.posix.join(destDir, ENUMS_DIR, ENUMS_FILE + '.ts'),
    renderTSNodes([...enumsMap.values()], '\n\n')
  );

  return {entitiesMap, enumsMap};
}

export function createEntityClass(ctx: ClassCreationContext): {
  classDeclaration: ts.ClassDeclaration,
  importInfos: ImportInfo[]
} {

  const heritageInfo = createEntityClassHeritage(ctx);
  const importInfos: ImportInfo[] = [];
  if (heritageInfo.parentEntity) {
    importInfos.push(createImportInfo(heritageInfo.parentEntity, ctx.isBaseProjectEntity))
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
    if (attributeTypeInfo.importInfo) { importInfos.push(attributeTypeInfo.importInfo); }

      const idAttrName = ctx.entity.idAttributeName ?? 'id';
      // REST API always sends ids as strings
      const typeNode = entityAttr.name === idAttrName
        ? ts.createKeywordTypeNode(ts.SyntaxKind.StringKeyword)
        : createUnionWithNull(attributeTypeInfo.node);

      // REST API puts the id into the property "id" regardless of the actual attribute name.
      const attrName = entityAttr.name === idAttrName ? 'id' : entityAttr.name;

      return ts.createProperty(
        undefined,
        undefined,
        attrName,
        ts.createToken(ts.SyntaxKind.QuestionToken),
        typeNode,
        undefined
      );
    }
  )];

  return {classMembers: allClassMembers, importInfos}
}

function createUnionWithNull(node: ts.TypeNode): ts.TypeNode {
  return ts.createUnionTypeNode([
    node,
    ts.createKeywordTypeNode(ts.SyntaxKind.NullKeyword)
  ]);
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

  if (mappingType === 'DATATYPE') {
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

  if (mappingType === 'ASSOCIATION' || mappingType === 'COMPOSITION') {
    refEntity = ctx.entitiesMap.get(entityAttr.type.fqn);

    if (refEntity) {
      switch (entityAttr.cardinality) {
        case 'MANY_TO_MANY':
        case 'ONE_TO_MANY':
          node = ts.createArrayTypeNode(
            ts.createTypeReferenceNode(entityAttr.type.className, undefined)
          );
          break;
        case 'ONE_TO_ONE':
        case 'MANY_TO_ONE':
        default:
          node = ts.createTypeReferenceNode(entityAttr.type.className, undefined);
          break;
      }
    }
  }

  //enums

  if (mappingType == 'ENUM') {
    enumDeclaration = ctx.enumsMap.get(entityAttr.type.fqn);
    if (enumDeclaration) {
      node = ts.createTypeReferenceNode(enumDeclaration.name.text, undefined);
    }
  }

  if (!node) {
    node = ts.createKeywordTypeNode(ts.SyntaxKind.AnyKeyword);
  }

  let importInfo = undefined;

  if (refEntity && refEntity.entity) importInfo = createImportInfo(refEntity, ctx.isBaseProjectEntity);

  if (enumDeclaration) importInfo = enumImportInfo(enumDeclaration, ctx.isBaseProjectEntity ? '../..' : '..');

  return {
    node,
    importInfo
  };
}

function createImportInfo(importedEntity: ProjectEntityInfo, isCurrentEntityBase: boolean): ImportInfo {
  if (isCurrentEntityBase && importedEntity.isBaseProjectEntity) {
    //we don't need BASE prefix if current entity and imported base entity in same base/ directory
    return {
      importPath: './' + getEntityModulePath(importedEntity.entity),
      className: importedEntity.entity.className
    };
  } else {
    return entityImportInfo(importedEntity);
  }
}

