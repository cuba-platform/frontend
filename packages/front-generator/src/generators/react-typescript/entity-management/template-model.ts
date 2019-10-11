import {CommonTemplateModel, EntityTemplateModel} from "../common/template-model";
import {entityManagementListType} from "./params";
import {Entity, EntityAttribute, View} from "../../../common/model/cuba-model";

export interface EditRelations {
  [propName: string]: EntityTemplateModel
}

export interface EntityManagementTemplateModel extends CommonTemplateModel {
  listComponentName: string;
  editComponentName: string;
  listType: entityManagementListType,
  nameLiteral: string;
  entity: EntityTemplateModel,
  listView: View,
  editView: View,
  editAttributes: EntityAttribute[],
  editRelations: EditRelations
}
