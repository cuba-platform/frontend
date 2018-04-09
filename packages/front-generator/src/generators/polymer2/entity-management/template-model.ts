import {CommonTemplateModel} from "../common/template-model";
import {entityManagementListType} from "./params";

export interface EntityManagementTemplateModel extends CommonTemplateModel {
  listComponentName: string;
  editComponentName: string;
  listType: entityManagementListType
}