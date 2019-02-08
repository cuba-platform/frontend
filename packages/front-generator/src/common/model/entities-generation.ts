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

export function generateEntities(projectModel: ProjectModel, destDir: string, fs: Generator.MemFsEditor ) : void  {
  const entities: Entity[] = getEntitiesArray(projectModel.entities);
  const baseProjectEntities: Entity[] = getEntitiesArray(projectModel.baseProjectEntities);

  entities.forEach( e => {
    entitiesMap.set(e.fqn, {
      baseProject: false,
      entity: e
    })
  });

  baseProjectEntities.forEach( e => {
    entitiesMap.set(e.fqn, {
      baseProject: true,
      entity: e
    })
  });

  for (const entity of entities) {
    fs.write(
      path.join(destDir, `${entity.name}.ts`),
      renderTSNodes(createEntityClass(entity, projectModel))
    )
  }

  for (const entity of baseProjectEntities) {
    if (!entity.name) {
      continue;
    }
    fs.write(
      path.join(destDir, BASE_ENTITIES_DIR, `${entity.name}.ts`),
      renderTSNodes(createEntityClass(entity, projectModel))
    )
  }
}


export function createEntityClass(entity: Entity, projectModel: ProjectModel): ts.ClassDeclaration {
  return ts.createClassDeclaration(
    undefined,
    [ts.createToken(ts.SyntaxKind.ExportKeyword)],
    entity.className,
    undefined,
    createEntityClassHeritage(entity, projectModel),
    createEntityClassMembers(entity)
  );
}

function createEntityClassHeritage(entity: Entity, projectModel: ProjectModel): ts.HeritageClause[] {
  if (!entity.parentClassName) {
    return [];
  }
  return [ts.createHeritageClause(
    ts.SyntaxKind.ExtendsKeyword,
    [
      ts.createExpressionWithTypeArguments(
        [],
        ts.createIdentifier(entity.parentClassName),
      )
    ]
  )];
}

function createEntityClassMembers(entity: Entity): ts.ClassElement[] {

  const classMembers = [
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
    return classMembers;
  }

  return [...classMembers,...entity.attributes.map(entityAttr => {

    return ts.createProperty(
      undefined,
      undefined,
      entityAttr.name,
      ts.createToken(ts.SyntaxKind.QuestionToken),
      ts.createUnionTypeNode([
        createAttributeType(entityAttr),
        ts.createKeywordTypeNode(ts.SyntaxKind.NullKeyword)
      ]),
      undefined
    );

  })];
}


function createAttributeType(entityAttr: EntityAttribute): ts.TypeNode {

  if (entityAttr.mappingType === MappingType.DATATYPE) {
    switch (entityAttr.type.fqn) {
      case 'java.lang.Boolean':
        return ts.createKeywordTypeNode(ts.SyntaxKind.BooleanKeyword);
      case 'java.lang.Integer':
        return ts.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword);
      case 'java.lang.String':
        return ts.createKeywordTypeNode(ts.SyntaxKind.StringKeyword);
      default:
        return ts.createKeywordTypeNode(ts.SyntaxKind.AnyKeyword);
    }
  }

  if (entityAttr.mappingType === MappingType.ASSOCIATION || entityAttr.mappingType === MappingType.COMPOSITION) {
    switch (entityAttr.cardinality) {
      case Cardinality.ONE_TO_ONE:
      case Cardinality.MANY_TO_ONE:
        return ts.createTypeReferenceNode(entityAttr.type.className, undefined);
      case Cardinality.MANY_TO_MANY:
      case Cardinality.ONE_TO_MANY:
        return ts.createArrayTypeNode(
          ts.createTypeReferenceNode(entityAttr.type.className, undefined)
        );
    }
  }

  return ts.createKeywordTypeNode(ts.SyntaxKind.AnyKeyword);
}


function renderTSNodes(node: ts.Node): string {
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
  return printer.printNode(
    ts.EmitHint.Unspecified,
    node,
    resultFile,
  );
}
