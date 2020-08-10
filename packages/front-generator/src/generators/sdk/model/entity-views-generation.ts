import {Entity, EntityAttribute, ProjectModel, View} from "../../../common/model/cuba-model";
import * as ts from "typescript";
import {LiteralTypeNode} from "typescript";
import {collectAttributesFromHierarchy} from '../../../common/model/cuba-model-utils';

const VIEW_NAME_TYPE_SUFFIX = 'ViewName';
const VIEW_NAME_TYPE_PARAMETER = 'V';
const excludes = ['SearchFolder', 'AppFolder']; // todo fix model export

export function createEntityViewTypes(entity: Entity, projectModel: ProjectModel): ts.Node[] {
  const {name: entityName, className, idAttributeName} = entity;
  if (!entityName || excludes.indexOf(className) > -1) {
    return [];
  }
  const views = findViews(entityName, projectModel);
  return [
    createViewNamesType(className, views),
    createEntityViewType(className, views, collectAttributesFromHierarchy(entity, projectModel), idAttributeName)
  ];
}

/**
 * E.g.
 *
 * ```typescript
 * export type EntityViewName = "_minimal" | "_local" | "_base" | "entity-edit";
 * ```
 */
function createViewNamesType(className: string, views: View[]): ts.TypeAliasDeclaration {
  return ts.createTypeAliasDeclaration(
    undefined,
    [
      ts.createToken(ts.SyntaxKind.ExportKeyword)
    ],
    className + VIEW_NAME_TYPE_SUFFIX,
    undefined,
    ts.createUnionTypeNode(views.map(view =>
      ts.createLiteralTypeNode(
        ts.createLiteral(view.name)
      )
    ))
  )
}


/**
 * todo - draw colon on new line
 * e.g.
 *
 * ```typescript
 * export type EntityView<V extends EntityViewName> = V extends '_minimal' ? Pick<Entity, 'id', 'name'> : never
 * ```
 *
 * @param className
 * @param views
 * @param allowedAttrs As of CUBA specific - project model could contains properties from inheritors, we need to
 * filter out such properties from generated views
 * @param idAttributeName
 */
function createEntityViewType(
  className: string, views: View[], allowedAttrs: EntityAttribute[], idAttributeName?: string
): ts.TypeAliasDeclaration {
  const typeNode: ts.TypeNode = views
    .filter(view => view.allProperties.length > 0)
    .reduceRight(
      (typeExpr: ts.TypeNode, view): ts.TypeNode => {
        return ts.createConditionalTypeNode(
          ts.createTypeReferenceNode(VIEW_NAME_TYPE_PARAMETER, undefined),
          ts.createLiteralTypeNode(
            ts.createLiteral(view.name)
          ),
          createPickPropertiesType(className, view, allowedAttrs, idAttributeName),
          typeExpr
        )
      },
      ts.createKeywordTypeNode(ts.SyntaxKind.NeverKeyword)
    );


  return ts.createTypeAliasDeclaration(
    undefined,
    [
      ts.createToken(ts.SyntaxKind.ExportKeyword)
    ],
    className + 'View',
    [ts.createTypeParameterDeclaration(
      ts.createIdentifier(VIEW_NAME_TYPE_PARAMETER),
      ts.createTypeReferenceNode(className + VIEW_NAME_TYPE_SUFFIX, undefined)
    )],
    typeNode
  )

}

/**
 * e.g.
 *
 * Pick<Entity, 'id', 'name'>
 *
 * @param className
 * @param view
 * @param allowedAttrs As of CUBA specific - project model could contains properties from inheritors, we need to
 * filter out such properties from generated views
 * @param idAttributeName
 */
function createPickPropertiesType(
  className: string, view: View, allowedAttrs: EntityAttribute[], idAttributeName: string = 'id'
): ts.TypeReferenceNode {

  const viewProperties = idAttributeName === 'id'
    ? [...view.allProperties]
    : view.allProperties.filter(property => property.name !== idAttributeName);

  if (!viewProperties.find(nameEqId) && allowedAttrs.find(nameEqIdAttrName(idAttributeName))) {
    viewProperties.unshift({name: 'id'});
  }

  const viewTypeNodes: LiteralTypeNode[] = viewProperties
    .filter(viewProperty => allowedAttrs.some(attr => {
      const name = (idAttributeName !== 'id' && viewProperty.name === 'id')
        ? idAttributeName
        : viewProperty.name;
      return attr.name === name;
    }))
    .map(property =>
      ts.createLiteralTypeNode(
        ts.createLiteral(property.name)
      )
    );

  return ts.createTypeReferenceNode(
    'Pick',
    [
      ts.createTypeReferenceNode(className, undefined),
      ts.createUnionTypeNode(viewTypeNodes)
    ]
  );
}

function findViews(name: string, projectModel: ProjectModel): View[] {
  if (!projectModel.views) {
    return []
  }
  return projectModel.views.filter((view) => view.entity === name);
}

const nameEqId = nameEqIdAttrName('id');

function nameEqIdAttrName(idAttrName: string) {
  return ({name}: {name: string}) => {
    return name === idAttrName;
  }
}