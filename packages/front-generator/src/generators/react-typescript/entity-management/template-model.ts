import {CommonTemplateModel} from "../common/template-model";
import {entityManagementListType} from "./params";
import {Entity, EntityAttribute, View} from "../../../common/model/cuba-model";

export interface EntityManagementTemplateModel extends CommonTemplateModel {
  listComponentName: string;
  editComponentName: string;
  listType: entityManagementListType,
  nameLiteral: string;
  entity: Entity,
  listView: View,
  editView: View,
  editAttributes: EntityAttribute[]
}
