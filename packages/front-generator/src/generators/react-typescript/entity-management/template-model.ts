import {CommonTemplateModel, EntityTemplateModel} from "../common/template-model";
import {entityManagementListType} from "./params";
import {EntityAttribute, View} from "../../../common/model/cuba-model";

export interface EditRelations {
  [propName: string]: EntityTemplateModel
}

export interface RelationImport {
  className: string
  path: string
}

export interface EntityManagementTemplateModel extends CommonTemplateModel {
  listComponentName: string;
  editComponentName: string;
  listType: entityManagementListType,
  nameLiteral: string;
  entity: EntityTemplateModel,
  listView: View,
  listAttributes: EntityAttribute[],
  editView: View,
  editAttributes: EntityAttribute[],
  editRelations: EditRelations,
  relationImports: RelationImport[]
}
