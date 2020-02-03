import {EntityMessages, EnumInfo, MetaClassInfo, MetaPropertyInfo} from "@cuba-platform/rest";

export function getPropertyInfo(metadata: MetaClassInfo[], entityName: string, propertyName: string): MetaPropertyInfo | null {
    const metaClass = metadata.find(mci => mci.entityName === entityName);
    if (metaClass == null) {
        return null;
    }
    const propInfo = metaClass.properties.find(prop => prop.name === propertyName);
    return propInfo || null
}

/**
 * A non-nullable version of {@link getPropertyInfo}
 *
 * @param propertyName
 * @param entityName
 * @param metadata
 *
 * @throws `Error` when `propertyInfo` is `null`
 */
export function getPropertyInfoNN(propertyName: string, entityName: string, metadata: MetaClassInfo[]): MetaPropertyInfo {
  const propertyInfo: MetaPropertyInfo | null = getPropertyInfo(
    metadata,
    entityName,
    propertyName);

  if (!propertyInfo) {
    throw new Error('Cannot find MetaPropertyInfo for property ' + propertyName);
  }

  return propertyInfo;
}

export function getEnumCaption(enumValueName: string, propertyInfo: MetaPropertyInfo, enums: EnumInfo[]): string | undefined {
  const enumInfo = enums.find(enumInfo => enumInfo.name === propertyInfo.type);

  if (!enumInfo) {
    return undefined;
  }

  const enumValue = enumInfo.values
    .find(enumValue => enumValue.name === enumValueName);

  if (!enumValue) {
    return undefined;
  }

  return enumValue.caption;
}

/**
 *
 * @param propertyName
 * @param entityName
 * @param messages
 *
 * @returns localized entity property caption
 */
export function getPropertyCaption(propertyName: string, entityName: string, messages: EntityMessages): string {
  return messages[entityName + '.' + propertyName];
}

export function isFileProperty(propertyInfo: MetaPropertyInfo): boolean {
  return (propertyInfo.type === 'sys$FileDescriptor') && isRelationProperty(propertyInfo);
}

export function isDateProperty({type}: MetaPropertyInfo): boolean {
  return type === 'date';
}

export function isLocalDateProperty({type}: MetaPropertyInfo): boolean {
  return type === 'localDate';
}

export function isTimeProperty({type}: MetaPropertyInfo): boolean {
  return type === 'time';
}

export function isLocalTimeProperty({type}: MetaPropertyInfo): boolean {
  return type === 'localTime';
}

export function isOffsetTimeProperty({type}: MetaPropertyInfo): boolean {
  return type === 'offsetTime';
}

export function isDateTimeProperty({type}: MetaPropertyInfo): boolean {
  return type === 'dateTime';
}

export function isLocalDateTimeProperty({type}: MetaPropertyInfo): boolean {
  return type === 'localDateTime';
}

export function isOffsetDateTimeProperty({type}: MetaPropertyInfo): boolean {
  return type === 'offsetDateTime';
}

export function isAnyDateProperty(propertyInfo: MetaPropertyInfo): boolean {
  return isDateProperty(propertyInfo)
    || isLocalDateProperty(propertyInfo);
}

export function isAnyTimeProperty(propertyInfo: MetaPropertyInfo): boolean {
  return isTimeProperty(propertyInfo)
    || isLocalTimeProperty(propertyInfo)
    || isOffsetTimeProperty(propertyInfo);
}

export function isAnyDateTimeProperty(propertyInfo: MetaPropertyInfo): boolean {
  return isDateTimeProperty(propertyInfo)
    || isLocalDateTimeProperty(propertyInfo)
    || isOffsetDateTimeProperty(propertyInfo);
}

export function isTemporalProperty(propertyInfo: MetaPropertyInfo): boolean {
  return isAnyDateProperty(propertyInfo)
    || isAnyTimeProperty(propertyInfo)
    || isAnyDateTimeProperty(propertyInfo);
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
