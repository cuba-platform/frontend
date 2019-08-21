import * as ts from "typescript";

export function param(name: string, typeName: string) {
  const paramType = ts.createTypeReferenceNode(typeName, undefined);
  return ts.createParameter(undefined, undefined, undefined, name, undefined, paramType);
}

export function str(text: string) {
  return ts.createStringLiteral(text);
}

export function importDeclaration(identifier: string, moduleSpec: string) {
  return ts.createImportDeclaration(
    undefined,
    undefined,
    ts.createImportClause(ts.createIdentifier(identifier), undefined),
    ts.createStringLiteral(moduleSpec));
}