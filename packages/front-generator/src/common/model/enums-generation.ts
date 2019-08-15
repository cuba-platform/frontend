import {Enum, EnumValue} from "./cuba-model";
import * as ts from "typescript";
import {EnumDeclaration, EnumMember} from "typescript";

export type EnumInfo = {
  fqn: string
  node: EnumDeclaration
}

export function createEnums(enums: Enum[]): EnumInfo[] {
  const enDeclarations: EnumInfo[] = [];
  const duplicates: string[] = [];

  enums.forEach(e => {

    const className = e.className;

    const ed = ts.createEnumDeclaration(
      undefined,
      [ts.createToken(ts.SyntaxKind.ExportKeyword)],
      className,
      getEnumMembers(e.values));

    if (enDeclarations.some(ed => ed.node.name.text === className)) {
      duplicates.push(className);
    }
    enDeclarations.push({fqn: e.fqn, node: ed});
  });

  duplicates.forEach(duplicateName => {
    enDeclarations
      .filter(ed => ed.node.name.text === duplicateName)
      .forEach(ed => {
        //todo util method
        const newName = ed.fqn.replace(/\./g, '_');
        ed.node = ts.createEnumDeclaration(undefined, [ts.createToken(ts.SyntaxKind.ExportKeyword)], newName, ed.node.members);
      })
  });

  return enDeclarations;
}

function getEnumMembers(values: EnumValue[]): EnumMember[] {
  const members: EnumMember[] = [];
  values.forEach(v => {
    members.push(ts.createEnumMember(v.name, ts.createStringLiteral(v.name)));
  });
  return members;
}
