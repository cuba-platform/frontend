import {EntityAttribute, RestParam} from "../../../../common/cuba-model";
import {EnumFieldModel, FieldModel, LookupFieldModel, PolymerUIFieldType} from "./index";

export const getRestParamFieldType = (restParam: RestParam): PolymerUIFieldType => {
  return PolymerUIFieldType.TEXT;
};

export const getRestParamFieldModel = (restParam: RestParam, bindPrefix: string): FieldModel => {
  return {
    type: getRestParamFieldType(restParam),
    bindPath: bindPrefix + restParam.name,
    errorBindPath: 'serverErrors.' + restParam.name,
    label: restParam.name,
    required: false,
    maxLength: null
  }
};