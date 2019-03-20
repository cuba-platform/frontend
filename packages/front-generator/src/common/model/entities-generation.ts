import {Cardinality, Entity, EntityAttribute, Enum, getEntitiesArray, MappingType, ProjectModel} from "./cuba-model";
import * as Generator from "yeoman-generator";
import * as path from "path";
import * as ts from "typescript";

const BASE_ENTITIES_DIR = 'base';

interface EntityInfo {
  entity: Entity;
  baseProject: boolean;
}

interface DatatypeInfo {
  kind: 'enum' | 'entity'
  datatype: EntityInfo | Enum;
}

const entitiesMap = new Map<string, EntityInfo>();

export function generateEntities(projectModel: ProjectModel, destDir: string, fs: Generator.MemFsEditor): void {
  const entities: Entity[] = getEntitiesArray(projectModel.entities);
  const baseProjectEntities: Entity[] = getEntitiesArray(projectModel.baseProjectEntities);

  entities.forEach(e => {
    entitiesMap.set(e.fqn, {
      baseProject: false,
      entity: e
    })
  });

  baseProjectEntities.forEach(e => {
    entitiesMap.set(e.fqn, {
      baseProject: true,
      entity: e
    })
  });

  for (const entity of entities) {
    const {refEntities, classDeclaration} = createEntityClass(entity);
    const includes = createIncludes(entity, refEntities, false);
    fs.write(
      path.join(destDir, `${entity.name}.ts`),
      renderTSNodes([...includes, classDeclaration])
    )
  }

  for (const entity of baseProjectEntities) {
    if (!entity.name) {
      continue;
    }
    const {refEntities, classDeclaration} = createEntityClass(entity);
    const includes = createIncludes(entity, refEntities, true);
    fs.write(
      path.join(destDir, BASE_ENTITIES_DIR, `${entity.name}.ts`),
      renderTSNodes([...includes, classDeclaration])
    )
  }
}


export function createEntityClass(entity: Entity): {
  classDeclaration: ts.ClassDeclaration,
  refEntities: EntityInfo[]
} {

  const heritageInfo = createEntityClassHeritage(entity);
  const refEntities: EntityInfo[] = [];
  if (heritageInfo.parentEntity) {
    refEntities.push(heritageInfo.parentEntity)
  }

  const classMembersInfo = createEntityClassMembers(entity);
  if (classMembersInfo.refEntities) {
    refEntities.push(...classMembersInfo.refEntities);
  }


  return {
    classDeclaration: ts.createClassDeclaration(
      undefined,
      [ts.createToken(ts.SyntaxKind.ExportKeyword)],
      entity.className,
      undefined,
      heritageInfo.heritageClauses,
      classMembersInfo.classMembers
    ),
    refEntities
  };
}

function createEntityClassHeritage(entity: Entity): {
  heritageClauses: ts.HeritageClause[]
  parentEntity?: EntityInfo
} {
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

function createEntityClassMembers(entity: Entity): {
  classMembers: ts.ClassElement[]
  refEntities: EntityInfo[]
} {

  const basicClassMembers = [
    ts.createProperty(
      undefined,
      [ts.createToken(ts.SyntaxKind.StaticKeyword)],
      'NAME',
      undefined,
      undefined,
      ts.createLiteral(entity.name)
    )
  ];

  if (!entity.attributes) {
    return {classMembers: basicClassMembers, refEntities: []};
  }

  const refEntities: EntityInfo[] = [];

  const allClassMembers = [...basicClassMembers, ...entity.attributes.map(entityAttr => {
    const attributeTypeInfo = createAttributeType(entityAttr);
    if (attributeTypeInfo.entity) {
      refEntities.push(attributeTypeInfo.entity);
    }
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

  return {classMembers: allClassMembers, refEntities}
}


function createAttributeType(entityAttr: EntityAttribute): {
  node: ts.TypeNode,
  entity?: EntityInfo
} {

  let node: ts.TypeNode | undefined;
  let refEntity: EntityInfo | undefined;

  if (entityAttr.mappingType === MappingType.DATATYPE) {
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

  if (entityAttr.mappingType === MappingType.ASSOCIATION || entityAttr.mappingType === MappingType.COMPOSITION) {
    refEntity = entitiesMap.get(entityAttr.type.fqn);

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

  if (!node) {
    node = ts.createKeywordTypeNode(ts.SyntaxKind.AnyKeyword);
  }

  return {
    node,
    entity: refEntity
  };
}

function createIncludes(entity: Entity, entities: EntityInfo[], isBaseEntity: boolean): ts.ImportDeclaration[] {
  return Array.from(new Set(entities))
    .filter(e => e.entity.name !== entity.name)
    .map(e => {
      return ts.createImportDeclaration(
        undefined,
        undefined,
        ts.createImportClause(
          undefined,
          ts.createNamedImports([
            ts.createImportSpecifier(undefined, ts.createIdentifier(e.entity.className))
          ])
        ),
        ts.createLiteral(
          getImportPath(e, isBaseEntity),
        ),
      );
    });
}

function getImportPath(importedEntity: EntityInfo, isBaseEntity: boolean) {
  if (!isBaseEntity && importedEntity.baseProject) {
    return `./${BASE_ENTITIES_DIR}/${importedEntity.entity.name}`;
  }

  return `./${importedEntity.entity.name}`;
}

function renderTSNodes(nodes: ts.Node[]): string {
  const resultFile = ts.createSourceFile(
    'temp.ts',
    '',
    ts.ScriptTarget.Latest,
    false,
    ts.ScriptKind.TS,
  );
  const printer = ts.createPrinter({
    newLine: ts.NewLineKind.LineFeed,
  });
  // todo VM
  let content = '';
  nodes.forEach(node => {
    content += printer.printNode(
      ts.EmitHint.Unspecified,
      node,
      resultFile,
    ) + '\n';
  });

  return content;
}
