import {WithId, getPropertyInfo, isOneToOneComposition, isOneToManyComposition} from '../metadata';
import {SerializedEntityProps, MetaClassInfo} from '@haulmont/jmix-rest';
import {TEMPORARY_ENTITY_ID_PREFIX} from '../data';

/**
 *
 * @param entityInstance
 * @param entityName
 * @param metadata
 *
 * @returns a shallow copy of a provided entity instance with temporary ids and read-only properties removed
 * (applied recursively to nested entities)
 */
export function prepareForCommit<T, U extends T & Partial<SerializedEntityProps> & WithId>(
  entityInstance: U, entityName: string, metadata: MetaClassInfo[]
): U {
  const processedInstance: Record<string, any> = {...entityInstance};

  Object.keys(processedInstance).forEach(key => {
    const propInfo = getPropertyInfo(metadata, entityName, key);

    if (key === 'id' && typeof processedInstance.id === 'string' && processedInstance.id.startsWith(TEMPORARY_ENTITY_ID_PREFIX)) {
      // Remove temporary id
      delete processedInstance.id;
      return;
    }

    // Remove read-only properties
    if (propInfo != null && propInfo.readOnly) {
      delete processedInstance[key];
      return;
    }

    // Call recursively for nested entities
    if (propInfo != null && processedInstance[key] != null) {
      if (isOneToOneComposition(propInfo)) {
        processedInstance[key] = prepareForCommit(processedInstance[key], propInfo.type, metadata);
        return;
      }
      if (isOneToManyComposition(propInfo)) {
        processedInstance[key] = processedInstance[key].map((e: U) => prepareForCommit(e, propInfo.type, metadata));
        return;
      }
    }
  });

  return processedInstance as U;
}