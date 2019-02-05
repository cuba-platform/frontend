import {Entity, ProjectModel} from "./cuba-model";
import * as Generator from "yeoman-generator";
import * as path from "path";
import * as ts from "typescript";

export function generateEntities(projectModel: ProjectModel, destDir: string, fs: Generator.MemFsEditor ) : void  {
  const entities: Entity[] = Array.isArray(projectModel.entities)
      ? projectModel.entities
      : Object.keys(projectModel.entities).map(k => (projectModel.entities as {[entityName: string]: Entity}) [k]);

  for (const entity of entities) {
    fs.write(
      path.join(destDir, `${entity.name}.ts`),
      generateEntity(entity, destDir)
    )
  }
}

export function generateEntity(entity: Entity, destDir: string): string {

  const entityClass = ts.createClassDeclaration(undefined, undefined, entity.className, undefined, [], []);
  return entityClass.;

}