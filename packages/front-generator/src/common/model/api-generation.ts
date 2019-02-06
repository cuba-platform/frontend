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
      generateEntity(entity)
    )
  }

  for (const entity of baseProjectEntities) {
    if (!entity.name) {
      continue;
    }
    fs.write(
      path.join(destDir, BASE_ENTITIES_DIR, `${entity.name}.ts`),
      generateEntity(entity)
    )
  }
}


export function generateEntity(entity: Entity): string {

  const entityClass = ts.createClassDeclaration(
    undefined,
    [ts.createToken(ts.SyntaxKind.ExportKeyword)],
    entity.className,
    undefined,
    [],
    createEntityClassMembers(entity.attributes)
  );
  return tsNodeToText(entityClass);

}

function createEntityClassMembers(attributes: EntityAttribute[]): ts.ClassElement[] {
  if (!attributes) {
    return [];
  }

  return attributes.map(entityAttr => {

    return ts.createProperty(
      undefined,
      undefined,
      entityAttr.name,
      undefined,
      createAttributeTypeRef(entityAttr),
      undefined
    );
  });
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