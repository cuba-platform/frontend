import {Enum, EnumValue} from "./cuba-model";
import * as ts from "typescript";
import {EnumDeclaration, EnumMember} from "typescript";

export function createEnums(enums: Enum[]): EnumDeclaration[] {
  const enDeclarations: EnumDeclaration[] = [];
  enums.forEach(e => enDeclarations.push(
    ts.createEnumDeclaration(
      undefined,
      [ts.createToken(ts.SyntaxKind.ExportKeyword)],
      e.className,
      getEnumMembers(e.values))
  ));
  return enDeclarations;
}

function getEnumMembers(values: EnumValue[]): EnumMember[] {
  const members: EnumMember[] = [];
  values.forEach(v => {
    members.push(ts.createEnumMember(v.name, ts.createStringLiteral(v.name)));
  });
  return members;
}
