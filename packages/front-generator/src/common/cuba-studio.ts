export const enum StudioTemplatePropertyType {
  ENTITY = 'ENTITY',
  VIEW = 'VIEW',
  STRING = 'STRING',
  BOOLEAN = 'BOOLEAN',
  INTEGER = 'INTEGER',
  OPTION = 'OPTION',
  MULTI_OPTION = 'MULTI_OPTION',
  REST_QUERY = 'REST_QUERY',
  REST_SERVICE_METHOD = 'REST_SERVICE_METHOD',
  POLYMER_COMPONENT_NAME = 'REST_SERVICE_METHOD'
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