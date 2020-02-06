import {CommonTemplateModel} from "../common/template-model";
import {Entity, EntityAttribute, View} from "../../../common/model/cuba-model";

export interface EntityCardsTemplateModel extends CommonTemplateModel {
  nameLiteral: string;
  entity: Entity,
  view: View,
  attributes: EntityAttribute[]
}