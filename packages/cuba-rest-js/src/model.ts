export type Cardinality = 'NONE' | 'ONE_TO_ONE' | 'MANY_TO_ONE' | 'ONE_TO_MANY' | 'MANY_TO_MANY';

export type AttributeType = 'DATATYPE' | 'ENUM' | 'ASSOCIATION' | 'COMPOSITION';

export interface SerializedEntityProps {
  _entityName: string;
  _instanceName: string;
}

export type SerializedEntity<T> = SerializedEntityProps & T;

export interface EntitiesWithCount<T> {
  result: Array<SerializedEntity<T>>;
  count: number;
}

export interface MetaPropertyInfo {
  name: string;
  type: string;
  mandatory: boolean;
  readOnly: boolean;
  isTransient: boolean;
  description: string;
  attributeType: AttributeType;
  cardinality: Cardinality;
}

export interface MetaClassInfo {
  entityName: string;
  properties: MetaPropertyInfo[];
}

export interface UserInfo {
  id: string;
  login: string;
  name: string;
  firstName: string;
  middleName: string;
  lastName: string;
  position: string;
  email: string;
  timeZone: string;
  language: string;
  _instanceName: string;
  locale: string;
}

export interface PermissionInfo {
  type: string;
  target: string;
  value: string;
  intValue: number;
}

export interface EnumValueInfo {
  name: string;
  id: string | number;
  caption: string;
}

export interface EnumInfo {
  name: string;
  values: EnumValueInfo[];
}

export type ViewProperty = string | {name: string, view: View};

export interface View {
  name: string;
  entity: string;
  properties: ViewProperty[];
}

export enum PredefinedView {
  MINIMAL = '_minimal',
  LOCAL = '_local',
  BASE = '_base', // Available since CUBA 6.7
}
