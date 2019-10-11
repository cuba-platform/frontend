import {MetaClassInfo, MetaPropertyInfo} from "@cuba-platform/rest";

export function getPropertyInfo(metadata: MetaClassInfo[], entityName: string, propertyName: string): MetaPropertyInfo | null {
    const metaClass = metadata.find(mci => mci.entityName === entityName);
    if (metaClass == null) {
        return null;
    }
    const propInfo = metaClass.properties.find(prop => prop.name === propertyName);
    return propInfo || null
}

export function isFileProperty(propertyInfo: MetaPropertyInfo): boolean {
  return (propertyInfo.type === 'sys$FileDescriptor') && isRelationProperty(propertyInfo);
}

export function isRelationProperty(propertyInfo: MetaPropertyInfo): boolean {
  return (propertyInfo.attributeType === 'ASSOCIATION') || (propertyInfo.attributeType === 'COMPOSITION');
}

export function isToOneRelation({cardinality}: MetaPropertyInfo): boolean {
  return cardinality === "MANY_TO_ONE" || cardinality === "ONE_TO_ONE";
}

export function isToManyRelation({cardinality}: MetaPropertyInfo): boolean {
  return cardinality === "ONE_TO_MANY" || cardinality === "MANY_TO_MANY";
}

export type WithId = {id?: string};

export type WithName = {name?: string};
