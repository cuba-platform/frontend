import {CommonTemplateModel} from "../common/template-model";
import {RestService, RestServiceMethod} from "../../../common/model/cuba-model";

export interface ServiceFormTemplateModel extends CommonTemplateModel {
  method: RestServiceMethod;
  service: RestService;
  fields: string[];
}