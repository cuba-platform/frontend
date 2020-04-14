import {action, computed, observable, runInAction, toJS} from "mobx";
import {
  PredefinedView, SerializedEntityProps, TemporalPropertyType, MetaClassInfo
} from "@cuba-platform/rest";
import {inject, IReactComponent, observer} from "mobx-react";
import * as React from "react";
import {DataContainer, DataContainerStatus} from "./DataContext";
import {getCubaREST, getMainStore} from "../app/CubaAppProvider";
import {MainStore} from "../app/MainStore";
import {
  getPropertyInfo, isOneToManyComposition, isOneToOneComposition,
  isTemporalProperty, isToManyAssociation,
  WithId,
  WithName,
  isToOneAssociation, isFileProperty, isRelationProperty,
} from "../util/metadata";
import moment from 'moment';
import {
  getDataTransferFormat,
} from '../util/formats';
import {TEMPORARY_ENTITY_ID_PREFIX} from "..";

/**
 * Retrieves an entity instance using Generic REST API.
 *
 * @typeparam T - entity type.
 */
export class DataInstanceStore<T> implements DataContainer {

  /**
   * Retrieved entity instance.
   */
  @observable item?: T & Partial<SerializedEntityProps> & { id?: string };
  /**
   * @inheritDoc
   */
  @observable status: DataContainerStatus = "CLEAN";
  /**
   * Name of the view used to limit the entity graph.
   */
  @observable viewName: string;

  /**
   * @inheritDoc
   */
  changedItems = observable([]);

  constructor(private mainStore: MainStore,
              public readonly entityName: string,
              viewName: string = PredefinedView.MINIMAL) {
    this.viewName = viewName;
  }

  /**
   * Retrieves an entity instance using the given id and view by sending a request to the REST API.
   *
   * @param id - id of an entity instance to be retrieved.
   */
  @action
  load = (id: string) => {
    this.item = undefined;
    if (!id) {
      return;
    }
    this.status = "LOADING";
    getCubaREST()!.loadEntity<T>(this.entityName, id, {view: this.viewName})
      .then((loadedEntity) => {
        runInAction(() => {
          this.item = loadedEntity;
          this.status = "DONE"
        })
      })
      .catch(() => {
        runInAction(() => {
          this.status = "ERROR"
        })
      })
  };

  /**
   * Sets the {@link item} to the provided value. Changes {@link status} to `DONE`.
   *
   * @param item - entity instance to be set as the {@link item}.
   */
  @action
  setItem(item: this["item"]) {
    this.item = item;
    this.status = "DONE";
  }

  /**
   * Sets the {@link item} based on provided values of Ant Design {@link https://3x.ant.design/components/form/ | Form} fields.
   *
   * @param formFields - a object representing the values of Ant Design {@link https://3x.ant.design/components/form/ | Form} fields.
   */
  @action
  setItemToFormFields(formFields: Partial<T>) {
    this.item = formFieldsToInstanceItem(formFields, this.entityName, toJS(this.mainStore.metadata!)) as T & Partial<SerializedEntityProps> & { id?: string };
    this.status = "DONE";
  }

  // TODO should return Promise<Partial<T>>
  /**
   * Updates the {@link item} using a provided `entityPatch`, then sends a request to the REST API to persist the changes.
   *
   * @param entityPatch - a `Partial` representing the changes to be made.
   * @returns a promise that resolves to the update result returned by the REST API.
   */
  @action
  update(entityPatch: Partial<T>): Promise<any> {
    const normalizedPatch: Record<string, any> = formFieldsToInstanceItem(entityPatch, this.entityName, toJS(this.mainStore.metadata!));
    Object.assign(this.item, normalizedPatch);
    return this.commit();
  }

  /**
   * Sends a request to the REST API to persist the changes made to the {@link item}.
   *
   * @returns a promise that resolves to the update result returned by the REST API.
   */
  @action
  commit = (): Promise<Partial<T>> => {
    if (this.item == null) {
      return Promise.reject();
    }
    this.status = 'LOADING';

    this.item = stripTemporaryIds(toJS(this.item)) as T & Partial<SerializedEntityProps> & { id?: string };

    return getCubaREST()!.commitEntity(this.entityName, toJS(this.item!))
      .then((updateResult) => {
        runInAction(() => {
          if (updateResult.id != null && this.item) {
            this.item.id = updateResult.id
            this.item._instanceName = updateResult._instanceName;
          }
          this.status = 'DONE';
        });
        return updateResult;
      })
      .catch((e) => {
        this.status = 'ERROR';
        throw e;
      })
  };

  /**
   * Transforms the {@link item} into the format expected by Ant Design {@link https://3x.ant.design/components/form/ | Form} fields.
   *
   * @param properties - entity properties that should be included in the result.
   * @returns entity instance transformed into the format expected by Ant Design {@link https://3x.ant.design/components/form/ | Form} fields.
   */
  getFieldValues(properties: string[]): Partial<{[prop in keyof T]: any}> {
    return instanceItemToFormFields<T>(
      this.item || {},
      this.entityName,
      toJS(this.mainStore!.metadata!),
      properties
    ) as Partial<{[prop in keyof T]: any}>;
  }

}

export interface DataInstanceOptions {
  /**
   * Whether to call the {@link DataInstanceStore#load} method immediately after the
   * {@link DataInstanceStore} is constructed.
   */
  loadImmediately?: boolean,
  /**
   * See {@link DataInstanceStore#viewName}
   */
  view?: string
}

export interface DataInstanceProps<E> extends DataInstanceOptions {
  entityName: string
  children: (store: Partial<DataInstanceStore<E>>) => React.ReactNode;
}

/**
 * Initialization function that instantiates a {@link DataInstanceStore}.
 *
 * @typeparam T - entity type.
 *
 * @param entityName - name of the entity to be retrieved.
 * @param opts - {@link DataInstanceStore} configuration.
 */
export function instance<T>(entityName: string, opts: DataInstanceOptions) {
  return new DataInstanceStore<T>(getMainStore(), entityName, opts.view);
}

export const withDataInstance = (entityName: string, opts: DataInstanceOptions = {loadImmediately: true}) => <T extends IReactComponent>(target: T) => {
  return inject(() => {
    const dataInstance = new DataInstanceStore(getMainStore(), entityName, opts.view);
    return {dataInstance}
  })(target);
};

export interface DataInstanceInjected<E> {
  dataInstance?: DataInstanceStore<E>
}

@observer
export class Instance<E> extends React.Component<DataInstanceProps<E>> {

  @observable store: DataInstanceStore<E>;

  constructor(props: DataInstanceProps<E>) {
    super(props);
    const {entityName, view} = this.props;
    this.store = new DataInstanceStore<E>(getMainStore(), entityName);
    if (view != null) {
      this.store.viewName = view;
    }
  }

  render() {
    return this.props.children(this.childrenProps);
  }

  @computed
  get childrenProps() {
    const {item, status, load, commit} = this.store;
    return {...{item, status, load, commit}};
  }
}

export function stripTemporaryIds(item: Record<string, any>): Record<string, any> {
  if (item != null && typeof item === 'object') {
    if ('id' in item && typeof item.id === 'string' && item.id.startsWith(TEMPORARY_ENTITY_ID_PREFIX)) {
      // Remove temporary id
      delete item.id;
    }

    // Repeat for nested entities
    Object.keys(item).forEach(key => {
      stripTemporaryIds(item[key]);
    });
  }

  return item;
}

/**
 * Transforms the antd Form fields values into format expected by Instance item, which is generally the same as the format
 * expected by REST API, except that Instance item may have a temporary id created client-side and stripped before commit
 *
 * @param formFields
 * @param entityName
 * @param metadata
 */
export function formFieldsToInstanceItem<T>(
  formFields: Record<string, any>, entityName: string, metadata: MetaClassInfo[]
): Record<string, any> {
  const item: Record<string, any> = {...formFields};
  Object.entries(formFields).forEach(([key, value]) => {
    const propInfo = getPropertyInfo(metadata!, entityName, key);

    if (propInfo && isOneToOneComposition(propInfo) && value != null) {
      item[key] = formFieldsToInstanceItem(value, propInfo.type, metadata);
      return;
    }

    if (propInfo && isOneToManyComposition(propInfo)) {
      value == null
        ? item[key] = []
        : item[key] = value.map((e: T) => formFieldsToInstanceItem(e, propInfo.type, metadata));
      return;
    }

    if (propInfo && isToOneAssociation(propInfo) && typeof value === 'string') {
      item[key] = {id: value};
      return;
    }

    if (propInfo && isToManyAssociation(propInfo) && Array.isArray(value)) {
      item[key] = value?.map(id => ({id}));
      return;
    }

    if (propInfo && isTemporalProperty(propInfo) && moment.isMoment(value)) {
      item[key] = value?.format(getDataTransferFormat(propInfo.type as TemporalPropertyType));
      return;
    }

    if (value === '' || value == null) {
      item[key] = null;
      return;
    }
  });
  return item;
}

/**
 * Transforms the provided `item` into the format expected by Ant Design {@link https://3x.ant.design/components/form/ | Form} fields.
 *
 * @typeparam T - entity type.
 *
 * @param item - entity instance to be transformed.
 * @param entityName
 * @param metadata - entities metadata.
 * @param displayedProperties - entity properties that should be included in the result. If not provided, all properties will be included.
 */
export function instanceItemToFormFields<T>(
  item: Record<string, any> | undefined, entityName: string, metadata: MetaClassInfo[], displayedProperties?: string[]
): Record<string, any> {

  if (item == null || metadata == null) {
    return {};
  }

  const fields: Record<string, any> = {};

  Object.entries(toJS(item)).forEach(([key, value]) => {
    const propInfo = getPropertyInfo(metadata, entityName, key);

    if (displayedProperties != null && displayedProperties.indexOf(key) === -1) {
      return;
    }

    if (propInfo == null) {
      fields[key] = value;
      return;
    }

    if(isOneToOneComposition(propInfo)) {
      if (value != null) {
        fields[key] = instanceItemToFormFields(value, propInfo.type, metadata);
      }
      return;
    }

    if (isOneToManyComposition(propInfo)) {
      value == null
        ? fields[key] = []
        : fields[key] = value.map((e: T) => instanceItemToFormFields(e, propInfo.type, metadata));
      return;
    }

    if (isToManyAssociation(propInfo)) {
      if (value == null) {
        fields[key] = [];
        return;
      }

      const entityList = value as unknown as WithId[];
      fields[key] = entityList.reduce<string[]>((accumulator, nextEntity) => {
        accumulator.push(nextEntity.id!);
        return accumulator;
      }, []);
      return;
    }

    if (isRelationProperty(propInfo) && value == null) {
      fields[key] = value;
      return;
    }

    if (isFileProperty(propInfo)) {
      fields[key] = {
        id: (value as WithId).id!,
        name: (value as WithName).name!,
      };
      return;
    }

    if (isToOneAssociation(propInfo)) {
      fields[key] = (value as WithId).id!;
      return;
    }

    if (isTemporalProperty(propInfo)) {
      if (value != null) {
        fields[key] = moment(value, getDataTransferFormat(propInfo.type as TemporalPropertyType));
      } else {
        fields[key] = null;
      }
      return;
    }

    if (value == null) {
      fields[key] = null;
      return;
    }

    fields[key] = value;
    return;
  });

  return fields;
}
