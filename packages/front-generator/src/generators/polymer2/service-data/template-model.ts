import {CommonTemplateModel} from "../common/template-model";
import {RestService, RestServiceMethod} from "../../../common/cuba-model";

export interface ServiceDataTemplateModel extends CommonTemplateModel {
  method: RestServiceMethod;
  service: RestService;
  fields: string[];
}