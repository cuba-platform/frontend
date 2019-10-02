import {Enum, EnumValue} from "../../../common/model/cuba-model";
import * as ts from "typescript";
import {EnumDeclaration, EnumMember} from "typescript";
import {fqnToName} from "../../../common/utils";

export type EnumInfo = {
  fqn: string
  node: EnumDeclaration
}

export function createEnums(enums: Enum[]): EnumInfo[] {

  //todo sort before generation - model generation could change order and test fail

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
        ed.node = ts.createEnumDeclaration(
          undefined,
          [ts.createToken(ts.SyntaxKind.ExportKeyword)],
          fqnToName(ed.fqn),
          ed.node.members);
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
