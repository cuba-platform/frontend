export type Cardinality = 'NONE' | 'ONE_TO_ONE' | 'MANY_TO_ONE' | 'ONE_TO_MANY' | 'MANY_TO_MANY';

export type AttributeType = 'DATATYPE' | 'ENUM' | 'ASSOCIATION' | 'COMPOSITION';

export interface IMetaPropertyInfo {
  name: string;
  type: string;
  mandatory: boolean;
  readOnly: boolean;
  isTransient: boolean;
  description: string;
  attributeType: AttributeType;
  cardinality: Cardinality;
}

export interface IMetaClassInfo {
  entityName: string;
  properties: IMetaPropertyInfo[];
}
