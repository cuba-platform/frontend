import {RestService, RestServiceMethod} from "../model/cuba-model";

export const enum StudioTemplatePropertyType {
  ENTITY = 'ENTITY',
  VIEW = 'VIEW',
  NESTED_ENTITY_VIEW = 'NESTED_ENTITY_VIEW',
  STRING = 'STRING',
  BOOLEAN = 'BOOLEAN',
  INTEGER = 'INTEGER',
  OPTION = 'OPTION',
  MULTI_OPTION = 'MULTI_OPTION',
  REST_QUERY = 'REST_QUERY',
  REST_SERVICE_METHOD = 'REST_SERVICE_METHOD',
  POLYMER_COMPONENT_NAME = 'POLYMER_COMPONENT_NAME'
}

export interface StudioTemplateProperty {
  code: string;
  caption: string;
  propertyType: StudioTemplatePropertyType;
  defaultValue?: string;
  required?: boolean;
  relatedProperty?: string;
  options?: string[];
  // --not supported
  //advanced: boolean;
  //filterScript: string;
}

export interface RestServiceMethodModel {
  service: RestService;
  method: RestServiceMethod;
}

export interface EntityInfo {
  name: string;
}

export interface ViewInfo {
  name: string;
  entityName: string;
}

export interface RestQueryInfo {
  name: string;
  entityName: string;
}

export interface RestServiceMethodInfo {
  serviceName: string;
  methodName: string;
}
