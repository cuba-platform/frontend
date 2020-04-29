import {CommonTemplateModel, EntityTemplateModel} from "../common/template-model";
import {EntityManagementListType} from "./params";
import {EntityAttribute, View} from "../../../common/model/cuba-model";

export interface EditRelations {
  [propName: string]: EntityTemplateModel
}

export interface EditRelationsSplit {
  editAssociations: EditRelations;
  editCompositions: EditRelations;
}

export interface RelationImport {
  className: string
  path: string
}

export interface EntityManagementTemplateModel extends CommonTemplateModel {
  listComponentName: string;
  editComponentName: string;
  listType: EntityManagementListType;
  nameLiteral: string;
  entity: EntityTemplateModel;
  listView: View;
  listAttributes: EntityAttribute[];
  editView: View;
  editAttributes: EntityAttribute[];
  editCompositions: EditRelations;
  editAssociations: EditRelations;
  nestedEntityInfo: Record<string, string>;
  relationImports: RelationImport[];
}
