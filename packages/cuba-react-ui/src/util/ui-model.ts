import {MetaPropertyInfo, SerializedEntityProps} from '@cuba-platform/rest';
import {DataCollectionStore, collection, WithId} from '@cuba-platform/react-core';

/**
 * Loads the lists of possible options (i.e. associated entity instances) for all one-to-many associations of a certain entity.
 * Makes one HTTP request per each association.
 *
 * @param entityProperties
 */
export const loadAssociationOptions = (
  entityProperties: MetaPropertyInfo[]
): Map<string, DataCollectionStore<Partial<WithId & SerializedEntityProps>>> => {
  const associationOptions = new Map<string, DataCollectionStore<Partial<WithId & SerializedEntityProps>>>();
  entityProperties.forEach(property => {
    if (property.attributeType !== 'ASSOCIATION' || property.cardinality === 'ONE_TO_MANY') {
      return;
    }
    const entityName = property.type;
    // `collection` factory method performs an HTTP request asynchronously
    const optionsContainer = collection<Partial<WithId & SerializedEntityProps>>(entityName, { view: "_minimal" });
    associationOptions.set(entityName, optionsContainer);
  });
  return associationOptions;
};
