import {action, computed, observable, runInAction, toJS} from "mobx";
import {PredefinedView, SerializedEntity} from "@cuba-platform/rest";
import {inject, IReactComponent, observer} from "mobx-react";
import * as React from "react";
import {DataContainer, DataContainerStatus} from "./DataContext";
import {getCubaREST, getMainStore} from "../app/CubaAppProvider";
import {MainStore, PropertyType} from "../app/MainStore";
import {getPropertyInfo} from "../util/metadata";


export class DataInstanceStore<T> implements DataContainer {

  @observable item?: SerializedEntity<T> & { id?: string };
  @observable status: DataContainerStatus = "CLEAN";
  @observable viewName: string;

  changedItems = observable([]);

  constructor(private mainStore: MainStore,
              public readonly entityName: string,
              viewName: string = PredefinedView.MINIMAL) {
    this.viewName = viewName;
    console.log(`withDataInstance$${entityName}`)
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
  update(entityPatch: Partial<T>): Promise<any> {
    Object.assign(this.item, entityPatch);
    return this.commit();
  }

  @action
  commit = () => {
    if (this.item == null) {
      return Promise.reject();
    }
    this.status = 'LOADING';
    return getCubaREST()!.commitEntity(this.entityName, toJS(this.item!))
      .then(() => {
        runInAction(() => {
          this.status = 'DONE';
        })
      })
      .catch(() => {
        this.status = 'ERROR';
      })
  };

  getFieldValues(properties: string[]): Partial<T> {
    const {metadata} = this.mainStore;
    if (this.item == null || metadata == null) {
      return {};
    }
    const entity: T = this.item ? toJS(this.item) : ({} as T);
    const entityFields: Partial<T> = (properties as Array<keyof T & string>).reduce<Partial<T>>(
      (acc: Partial<T>, propertyName) => {
        const propertyInfo = getPropertyInfo(toJS(metadata), this.entityName, propertyName);
        if (propertyInfo == null) {
          acc[propertyName] = entity[propertyName];
          return acc;
        }
        if (propertyInfo.type as PropertyType === "date") { // todo
          acc[propertyName] = entity[propertyName];
          return acc;
        } else {
          acc[propertyName] = entity[propertyName];
          return acc;
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