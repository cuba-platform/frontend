import {CommonTemplateModel} from "../common/template-model";
import {Entity, View} from "../../../common/cuba-model";

export interface EntityListTemplateModel extends CommonTemplateModel {
  entity:  Entity,
  view: View,
}