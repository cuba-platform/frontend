export declare type Cardinality = 'NONE' | 'ONE_TO_ONE' | 'MANY_TO_ONE' | 'ONE_TO_MANY' | 'MANY_TO_MANY';
export declare type AttributeType = 'DATATYPE' | 'ENUM' | 'ASSOCIATION' | 'COMPOSITION';
export interface EntitiesWithCount<T> {
    result: T[];
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
export interface View {
    name: string;
    entity: string;
    properties: string[];
}
export declare const enum PredefinedView {
  MINIMAL = "_minimal",
  LOCAL = "_local",
  BASE = "_base",
}
