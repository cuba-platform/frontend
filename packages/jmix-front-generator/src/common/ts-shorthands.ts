import * as ts from "typescript";
import {ParameterDeclaration, StringLiteral} from "typescript";

export function param(name: string, typeName: string): ParameterDeclaration {
  const paramType = ts.createTypeReferenceNode(typeName, undefined);
  return ts.createParameter(undefined, undefined, undefined, name, undefined, paramType);
}

export function str(text: string): StringLiteral {
  return ts.createStringLiteral(text);
}

export function exportModifier() {
  return ts.createToken(ts.SyntaxKind.ExportKeyword);
}

export function idn(text: string) {
  return ts.createIdentifier(text);
}