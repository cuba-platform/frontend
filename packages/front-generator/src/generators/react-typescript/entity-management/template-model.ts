import {EntityTemplateModel} from "../common/template-model";
import {EntityManagementListType} from "./params";
import {EntityAttribute, View} from "../../../common/model/cuba-model";
import {BaseEntityScreenTemplateModel} from '../common/base-entity-screen-generator/template-model';

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

export interface EntityManagementTemplateModel extends BaseEntityScreenTemplateModel {
  listComponentClass: string;
  editComponentClass: string;
  listType: EntityManagementListType;
  nameLiteral: string;
  entity: EntityTemplateModel;
  listView: View;
  listAttributes: EntityAttribute[];
  editView: View;
  editAttributes: EntityAttribute[];
  readOnlyFields: string[];
  editCompositions: EditRelations;
  editAssociations: EditRelations;
  nestedEntityInfo?: Record<string, string>;
  relationImports: RelationImport[];
}
