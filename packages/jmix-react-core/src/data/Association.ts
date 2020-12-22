import {collection, DataCollectionOptions, DataCollectionStore} from './Collection';
import {EntityAttrPermissionValue, MetaPropertyInfo, SerializedEntityProps} from '@haulmont/jmix-rest';
import {WithId} from '../util/metadata';

/**
 * Invokes Generic REST API to retrieve the possible options for an Association attribute
 * (i.e. entity instances that can be used as a value of that attribute).
 * The request will be sent only if the user has a permission to read that attribute.
 * Returns a `DataCollectionStore` instance (see CUBA React Core API Reference)
 * or `undefined` if the user doesn't have a permission to read the attribute.
 * The instance is returned immediately, but it will only contain the retrieved options
 * once the request to Generic REST API is complete.
 * The instance will contain the retrieved options as its `items` property (MobX observable).
 *
 * @param parentEntityName - name of the entity containing an Association attribute
 * @param attributeName - name of the Association attribute
 * @param nestedEntityName - name of the entity contained in the Association attribute
 * @param getAttributePermission - function returning user's permission for a given entity attribute
 * @param opts - `DataCollectionStore` configuration options
 *
 * @returns a `DataCollectionStore` instance that will (once the request to Generic REST API is complete)
 * contain the retrieved options as its `items` property (MobX observable).
 * If the user doesn't have a permission to read the attribute, an `undefined` will be returned instead.
 */
export const loadAssociationOptions = <E>(
  parentEntityName: string,
  attributeName: string,
  nestedEntityName: string,
  getAttributePermission: (entityName: string, attributeName: string) => EntityAttrPermissionValue,
  opts: DataCollectionOptions = { view: "_minimal" }
): DataCollectionStore<E> | undefined => {
  const permission: EntityAttrPermissionValue = getAttributePermission(parentEntityName, attributeName);
  // `collection` initialization function performs an HTTP request asynchronously
  return (permission === 'VIEW' || permission === 'MODIFY')
    ? collection<E>(nestedEntityName, opts)
    : undefined;
}

/**
 * Invokes Generic REST API to retrieve the lists of possible options for each Association attribute of a given entity
 * (possible options meaning entity instances that can be used as a value of that attribute).
 * Requests will be sent only for the attributes that the user is permitted to read.
 * Returns a `Map` where keys are associated entity names and values are `DataCollectionStore` instances (see CUBA React Core API Reference)
 * or `undefined` if the user doesn't have a permission to read the attribute.
 * The map is returned immediately, but each `DataCollectionStore` will only contain the retrieved options
 * once the corresponding request to Generic REST API is complete.
 * Upon successfull request, a `DataCollectionStore` will contain the retrieved options as its `items` property (MobX observable).
 *
 * @param entityProperties - entity properties metadata
 * @param entityName
 * @param getAttributePermission - function returning user's permission for a given entity attribute
 * @param opts - `DataCollectionStore` configuration options
 *
 * @returns a `Map` where keys are associated entity names and values are `DataCollectionStore` instances
 * that will (once the requests to Generic REST API are complete) contain
 * the retrieved options as their `items` property (MobX observable).
 * If the user doesn't have a permission to read some of the attributes, the corresponding values will contain
 * `undefined`.
 */
export const loadAllAssociationOptions = (
  entityProperties: MetaPropertyInfo[],
  entityName: string,
  getAttributePermission: (entityName: string, attributeName: string) => EntityAttrPermissionValue,
  opts?: DataCollectionOptions
): Map<string, DataCollectionStore<Partial<WithId & SerializedEntityProps>> | undefined> => {
  const associationOptions = new Map<string, DataCollectionStore<Partial<WithId & SerializedEntityProps>> | undefined>();
  entityProperties.forEach(property => {
    if (property.attributeType !== 'ASSOCIATION' || property.cardinality === 'ONE_TO_MANY') {
      return;
    }
    const nestedEntityName = property.type;
    const optionsContainer = loadAssociationOptions<Partial<WithId & SerializedEntityProps>>(
      entityName,
      property.name,
      nestedEntityName,
      getAttributePermission,
      opts
    );
    associationOptions.set(nestedEntityName, optionsContainer);
  });
  return associationOptions;
};
