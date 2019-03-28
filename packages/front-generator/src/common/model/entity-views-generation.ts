import {Entity, ProjectModel, View} from "./cuba-model";
import * as ts from "typescript";

export function createEntityViewTypes(entity: Entity, projectModel: ProjectModel): ts.Node[] {
  const {name: entityName, className} = entity;
  if (!entityName) {
    return [];
  }
  const views = findViews(entityName, projectModel);
  return [
    createViewNamesType(className, views),
    ...createViewTypes(className, views)
  ];
}

function createViewNamesType(className: string, views: View[]): ts.TypeAliasDeclaration {
  return ts.createTypeAliasDeclaration(
    undefined,
    [ts.createToken(ts.SyntaxKind.ExportKeyword)],
    className + 'ViewName',
    undefined,
    ts.createUnionTypeNode(views.map(view =>
      ts.createLiteralTypeNode(
        ts.createLiteral(view.name)
      )
    ))
  )
}

function createViewTypes(className: string, views: View[]): ts.TypeAliasDeclaration[] {
  return views
    .filter(view => view.allProperties.length > 0)
    .map(view =>
      ts.createTypeAliasDeclaration(
        undefined,
        [ts.createToken(ts.SyntaxKind.ExportKeyword)],
        className + '_' + view.name.replace(/-/g, '_'),
        undefined,
        ts.createTypeReferenceNode(
          'Pick',
          [
            ts.createTypeReferenceNode(className, undefined),
            ts.createUnionTypeNode(view.allProperties.map(property =>
              ts.createLiteralTypeNode(
                ts.createLiteral(property.name)
              )
            ))
          ]
        )
      )
    );
}

function findViews(name: string, projectModel: ProjectModel): View[] {
  if (!projectModel.views) {
    return []
  }
  return projectModel.views.filter((view) => view.entity === name);
}
