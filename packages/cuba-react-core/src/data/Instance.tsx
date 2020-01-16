import {action, computed, observable, runInAction, toJS} from "mobx";
import {PredefinedView, SerializedEntityProps, PropertyType} from "@cuba-platform/rest";
import {inject, IReactComponent, observer} from "mobx-react";
import * as React from "react";
import {DataContainer, DataContainerStatus} from "./DataContext";
import {getCubaREST, getMainStore} from "../app/CubaAppProvider";
import {MainStore} from "../app/MainStore";
import {
  getPropertyInfo,
  isDateProperty, isDateTimeProperty,
  isTimeProperty,
  isToManyRelation,
  isToOneRelation,
  WithId,
  WithName
} from "../util/metadata";
import moment from 'moment';
import {defaultDateFormat, defaultDateTimeFormat, defaultTimeFormat} from '../util/formats';


export class DataInstanceStore<T> implements DataContainer {

  @observable item?: T & Partial<SerializedEntityProps> & { id?: string };
  @observable status: DataContainerStatus = "CLEAN";
  @observable viewName: string;

  changedItems = observable([]);

  constructor(private mainStore: MainStore,
              public readonly entityName: string,
              viewName: string = PredefinedView.MINIMAL) {
    this.viewName = viewName;
  }

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

  @action
  setItem(item: this["item"]) {
    this.item = item;
    this.status = "DONE";
  }

  @action
  update(entityPatch: Partial<T>): Promise<any> {
    const metadata = toJS(this.mainStore.metadata);
    const normalizedPatch: Record<string, any> = {...entityPatch};
    Object.entries(entityPatch).forEach(([key, value]) => {
      const propInfo = getPropertyInfo(metadata!, this.entityName, key);
      if (propInfo && isToOneRelation(propInfo)
            && typeof value === 'string') {
        normalizedPatch[key] = {id: value};
      }
      if (propInfo && isToManyRelation(propInfo) && Array.isArray(value)) {
        normalizedPatch[key] = value.map(id => ({id}));
      }
      if (propInfo && isDateProperty(propInfo) && moment.isMoment(value)) {
        normalizedPatch[key] = value.format(defaultDateFormat);
      }
      if (propInfo && isTimeProperty(propInfo) && moment.isMoment(value)) {
        normalizedPatch[key] = value.format(defaultTimeFormat);
      }
      if (propInfo && isDateTimeProperty(propInfo) && moment.isMoment(value)) {
        normalizedPatch[key] = value.format(defaultDateTimeFormat);
      }
      if (value === '' || value == null) {
        normalizedPatch[key] = null;
      }
    });
    Object.assign(this.item, normalizedPatch);
    return this.commit();
  }

  @action
  commit = (): Promise<void> => {
    if (this.item == null) {
      return Promise.reject();
    }
    this.status = 'LOADING';
    return getCubaREST()!.commitEntity(this.entityName, toJS(this.item!))
      .then((updatedEntity) => {
        runInAction(() => {
          if (updatedEntity.id != null) {
            this.item!.id = updatedEntity.id
          }
          this.status = 'DONE';
        })
      })
      .catch((e) => {
        this.status = 'ERROR';
        throw e;
      })
  };

  getFieldValues(properties: string[]): Partial<{[prop in keyof T]: any}> {
    const {metadata} = this.mainStore;
    if (this.item == null || metadata == null) {
      return {};
    }
    const entity: T = this.item ? toJS(this.item) : ({} as T);
    const entityFields = (properties as Array<keyof T & string>).reduce<Partial<{[prop in keyof T]: any}>>(
      (fields: Partial<{[prop in keyof T]: any}>, propertyName) => {
        const propertyInfo = getPropertyInfo(toJS(metadata), this.entityName, propertyName);
        if (propertyInfo == null) {
          fields[propertyName] = entity[propertyName];
          return fields;
        }

        const type = propertyInfo.type as PropertyType;

        if (propertyInfo.attributeType === "ASSOCIATION") {
          if (entity[propertyName] == null) {
            fields[propertyName] = entity[propertyName];
            return fields;
          }

          if (isToOneRelation(propertyInfo)) {
            if (propertyInfo.type === 'sys$FileDescriptor') {
              fields[propertyName] = {
                id: (entity[propertyName] as WithId).id!,
                name: (entity[propertyName] as WithName).name!,
              };
            } else {
              fields[propertyName] = (entity[propertyName] as WithId).id!;
            }
            return fields;
          }

          if (isToManyRelation(propertyInfo)) {
            // @ts-ignore
            const entityList = (entity[propertyName] as WithId[]);
            // @ts-ignore
            fields[propertyName] = entityList.reduce<string[]>((accumulator, nextEntity) => {
              accumulator.push(nextEntity.id!);
              return accumulator;
            }, []);
            return  fields;
          }
        }

        if (isTemporalType(type)) {
          if (entity[propertyName] == null) {
            fields[propertyName] = null;
          } else {
            fields[propertyName] = moment(entity[propertyName]);
          }
          return fields;
        } else {
          fields[propertyName] = entity[propertyName];
          return fields;
        }
      },
      {}
    );
    return entityFields;
  }
}

export interface DataInstanceOptions {
  loadImmediately?: boolean,
  view?: string
}

export interface DataInstanceProps<E> extends DataInstanceOptions {
  entityName: string
  children: (store: Partial<DataInstanceStore<E>>) => React.ReactNode;
}

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

function isTemporalType(type: string): boolean {
  return ["date", "time", "dateTime"].indexOf(type) > -1;
}
