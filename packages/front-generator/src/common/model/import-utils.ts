import * as ts from "typescript";
import {BASE_ENTITIES_DIR, ProjectEntityInfo} from "./entities-generation";
import {Entity} from "./cuba-model";

export type ImportInfo = {
  className: string;
  importPath: string;
}

export function createIncludes(importInfos: ImportInfo[], current: ImportInfo): ts.ImportDeclaration[] {
  const uniqueImports: ImportInfo[] = [];
  importInfos.forEach(ii => {
    if (!uniqueImports.some(u => u.importPath == ii.importPath && u.className == ii.className)
    && !(ii.className == current.className && ii.importPath ==  current.importPath)) {
      uniqueImports.push(ii);
    }
  });

  return uniqueImports
    .map((importInfo: ImportInfo) => {
      return ts.createImportDeclaration(
        undefined,
        undefined,
        ts.createImportClause(
          undefined,
          ts.createNamedImports([
            ts.createImportSpecifier(undefined, ts.createIdentifier(importInfo.className))
          ])
        ),
        ts.createLiteral(importInfo.importPath
        ),
      );
    });
}

export function entityImportInfo(re: ProjectEntityInfo, isBaseProjectEntity: boolean): ImportInfo {
  return {
    className: re.entity.className,
    importPath: getImportPath(re, isBaseProjectEntity)
  };
}

function getImportPath(importedEntity: ProjectEntityInfo, isBaseEntity: boolean) {
  if (!isBaseEntity && importedEntity.isBaseProjectEntity) {
    return `./${BASE_ENTITIES_DIR}/${getEntityModuleName(importedEntity.entity)}`;
  }

  return `./${getEntityModuleName(importedEntity.entity)}`;
}

export function getEntityModuleName(entity: Entity): string {
  if (entity.name != null) {
    return entity.name;
  }
  return entity.className;
}
