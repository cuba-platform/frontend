import {Entity, EntityAttribute, MappingType, ProjectModel} from "./cuba-model";
import * as Generator from "yeoman-generator";
import * as path from "path";
import * as ts from "typescript";

const BASE_ENTITIES_DIR = 'base';

export function generateEntities(projectModel: ProjectModel, destDir: string, fs: Generator.MemFsEditor ) : void  {
  const entities: Entity[] = getEntitiesArray(projectModel.entities);
  const baseProjectEntities: Entity[] = getEntitiesArray(projectModel.baseProjectEntities);

  for (const entity of entities) {
    fs.write(
      path.join(destDir, `${entity.name}.ts`),
      tsNodeToText(createEntityClass(entity, projectModel))
    )
  }

  for (const entity of baseProjectEntities) {
    if (!entity.name) {
      continue;
    }
    fs.write(
      path.join(destDir, BASE_ENTITIES_DIR, `${entity.name}.ts`),
      tsNodeToText(createEntityClass(entity, projectModel))
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
      createAttributeTypeRef(entityAttr),
      undefined
    );

  })];
}


function getEntitiesArray(entities: Entity[] | {[entityName: string]: Entity} | undefined): Entity[] {
  if (!entities) {
    return [];
  }
  return Array.isArray(entities)
    ? entities
    : Object.keys(entities).map(k => (entities as { [entityName: string]: Entity }) [k]);
}


function createAttributeTypeRef(entityAttr: EntityAttribute) {
  let typeName: string = 'any';

  if (entityAttr.mappingType === MappingType.DATATYPE) {
    switch (entityAttr.type.fqn) {
      case 'java.lang.Boolean':
        typeName = 'boolean';
        break;
      case 'java.lang.Integer':
        typeName = 'number';
        break;
      case 'java.lang.String':
        typeName = 'string';
        break;
      default:
        typeName = 'any';
    }
  }

  return ts.createTypeReferenceNode(
    typeName,
    undefined
  );
}


function tsNodeToText(node: ts.Node): string {
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