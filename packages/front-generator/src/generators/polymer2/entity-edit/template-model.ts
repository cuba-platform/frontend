import {CommonTemplateModel} from "../common/template-model";
import {Entity, View} from "../../../common/cuba-model";

export interface EntityEditTemplateModel extends CommonTemplateModel {
  view: View,
  entity: Entity,
  imports: string[],
  fields: string[]
}