import {CommonTemplateModel} from "../common/template-model";
import {Entity, View} from "../../../common/model/cuba-model";

export interface EntityListTemplateModel extends CommonTemplateModel {
  entity:  Entity,
  view: View,
}