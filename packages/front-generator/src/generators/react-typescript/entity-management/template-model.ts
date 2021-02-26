import {EntityTemplateModel} from "../common/template-model";
import {EntityAttribute, View} from "../../../common/model/cuba-model";
// noinspection ES6PreferShortImport
import {BaseEntityScreenTemplateModel} from '../common/base-entity-screen-generator/template-model';

export interface EditRelations {
  [propName: string]: EntityTemplateModel
}

export interface EditRelationsSplit {
  editAssociations: EditRelations;
  editCompositions: EditRelations;
  editEmbeddeds: EditRelations;
}

export interface RelationImport {
  className: string
  path: string
}

export interface EntityManagementTemplateModel<T extends string> extends BaseEntityScreenTemplateModel {
  listComponentClass: string;
  editComponentClass: string;
  listType: T;
  nameLiteral: string;
  entity: EntityTemplateModel;
  listView: View;
  listAttributes: EntityAttribute[];
  editView: View;
  editAttributes: EntityAttribute[];
  editFieldStringPaths: string[];
  readOnlyFields: string[];
  editCompositions: EditRelations;
  editAssociations: EditRelations;
  nestedEntityInfo?: Record<string, string>;
  relationImports: RelationImport[];
}
