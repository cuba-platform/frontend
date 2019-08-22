import * as ts from "typescript";
import {ImportDeclaration, ParameterDeclaration, StringLiteral} from "typescript";

export function param(name: string, typeName: string): ParameterDeclaration {
  const paramType = ts.createTypeReferenceNode(typeName, undefined);
  return ts.createParameter(undefined, undefined, undefined, name, undefined, paramType);
}

export function str(text: string): StringLiteral {
  return ts.createStringLiteral(text);
}

export function importDeclaration(identifier: string, moduleSpec: string): ImportDeclaration {
  return ts.createImportDeclaration(
    undefined,
    undefined,
    ts.createImportClause(ts.createIdentifier(identifier), undefined),
    ts.createStringLiteral(moduleSpec));
}

export function exportModifier() {
  return ts.createToken(ts.SyntaxKind.ExportKeyword);
}
