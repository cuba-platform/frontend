import {CommonTemplateModel} from "../common/template-model";
import {RestQuery} from "../../../common/model/cuba-model";

export interface QueryResultsTemplateModel extends CommonTemplateModel {
   query: RestQuery;
   fields: string[];
}