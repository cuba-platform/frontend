import * as ts from "typescript";
import {EnumDeclaration, ImportDeclaration} from "typescript";
import {ProjectEntityInfo} from "./model/entities-generation";
import {BASE_ENTITIES_DIR, ENUMS_DIR, ENUMS_FILE} from "../../common/constants";
import {getEntityModulePath} from "../../common/utils";
import * as path from "path";

export type ImportInfo = {
  className: string;
  importPath: string;
}

export function createIncludes(importInfos: ImportInfo[], current?: ImportInfo): ts.ImportDeclaration[] {

  //todo do not add space between each include line

  //filter unique and exclude current entity, group by importPath
  const importByPathMap: Map<string, ImportInfo[]> = new Map();
  importInfos
    .filter(imp => !isImportEquals(imp, current))
    .forEach(imp => {
      const importByPath = importByPathMap.get(imp.importPath);
      if (importByPath) {
        if (!importByPath.some(i => isImportEquals(i, imp))) {
          importByPath.push(imp);
        }
      } else {
        importByPathMap.set(imp.importPath, [imp]);
      }
    });

  return [...importByPathMap.entries()]
    .map(([importPath, importInfos]) => {
      return importDeclaration(importInfos.map(ii => ii.className), importPath);
    });
}

export function importDeclaration(identifiers: string[], moduleSpec: string): ImportDeclaration {
  const elements = identifiers.map(idn =>
    ts.createImportSpecifier(undefined, ts.createIdentifier(idn)));

  return ts.createImportDeclaration(
    undefined,
    undefined,
    ts.createImportClause(
      undefined,
      ts.createNamedImports(elements)
    ),
    ts.createLiteral(moduleSpec),
  );
}

export function entityImportInfo(importedEntity: ProjectEntityInfo, prefix: string = ''): ImportInfo {
  const basePrefix = importedEntity.isBaseProjectEntity ? '' + BASE_ENTITIES_DIR : '';
  return {
    importPath: normalizeImportPath(getEntityModulePath(importedEntity.entity, path.posix.join(prefix, basePrefix))),
    className: importedEntity.entity.className
  };
}

export function enumImportInfo(ed: EnumDeclaration, pathPrefix?: string) {
  return {
    className: ed.name.text,
    importPath: normalizeImportPath(path.posix.join(pathPrefix ? pathPrefix : '', `${ENUMS_DIR}/${ENUMS_FILE}`))
  };
}

function normalizeImportPath(impPath: string) {
  return !impPath.startsWith('./') && !impPath.startsWith('..') ?  './' + impPath : impPath;
}

export function isImportEquals(ii1: ImportInfo | undefined, ii2: ImportInfo | undefined): boolean {
  if (ii1 == undefined && ii2 == undefined) return true;
  if (ii1 == undefined || ii2 == undefined) return false;
  return ii1.importPath == ii2.importPath && ii1.className == ii2.className;
}

