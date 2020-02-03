export type Cardinality = 'NONE' | 'ONE_TO_ONE' | 'MANY_TO_ONE' | 'ONE_TO_MANY' | 'MANY_TO_MANY';

export type AttributeType = 'DATATYPE' | 'ENUM' | 'ASSOCIATION' | 'COMPOSITION';

export type TemporalPropertyType =
  'date' | 'time' | 'dateTime' | 'localDate' | 'localTime' | 'localDateTime' | 'offsetDateTime' | 'offsetTime';

export type PropertyType = TemporalPropertyType |
  'string' | 'uuid'
  | 'byteArray'
  | 'int' | 'long' | 'double' | 'decimal'
  | 'boolean';

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

export type EntityOperationType = 'create' | 'read' | 'update' | 'delete';

export enum PermissionType {
  SCREEN = 'SCREEN',
  ENTITY_OP = 'ENTITY_OP',
  ENTITY_ATTR = 'ENTITY_ATTR',
  SPECIFIC = 'SPECIFIC',
  UI = 'UI'
}

export type BasePermissionValue = 'DENY' | 'ALLOW';
export type EntityAttrPermissionValue = 'DENY' | 'VIEW' | 'MODIFY';
export type UiPermissionValue = 'HIDE' | 'READ_ONLY' | 'SHOW';

export interface PermissionInfo {
  type: PermissionType;
  target: string;
  value: BasePermissionValue | EntityAttrPermissionValue | UiPermissionValue;
  intValue: number;
}

export enum RoleType {
  STANDARD = 'STANDARD',
  SUPER = 'SUPER',
  READONLY = 'READONLY',
  DENYING = 'DENYING',
  STRICTLY_DENYING = 'STRICTLY_DENYING'
}

export interface RoleInfo {
  roleType: RoleType | null;
}

export interface RolesInfo {
  permissions: PermissionInfo[];
  roles: RoleInfo[];
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

export interface EntityMessages {
  [messageKey: string]: string;
}
