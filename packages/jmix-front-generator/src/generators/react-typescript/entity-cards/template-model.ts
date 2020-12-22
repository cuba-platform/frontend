import {Entity, EntityAttribute, View} from "../../../common/model/cuba-model";
import {BaseEntityScreenTemplateModel} from '../common/base-entity-screen-generator/template-model';

export interface EntityCardsTemplateModel extends BaseEntityScreenTemplateModel {
  nameLiteral: string;
  entity: Entity,
  view: View,
  attributes: EntityAttribute[]
}