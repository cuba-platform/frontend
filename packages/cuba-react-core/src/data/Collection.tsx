import {action, computed, IObservableArray, observable, reaction, runInAction, toJS} from "mobx";
import {
  EntitiesLoadOptions,
  EntitiesWithCount,
  EntityFilter,
  PredefinedView,
  SerializedEntity
} from "@cuba-platform/rest";
import {inject, IReactComponent, observer} from "mobx-react";
import * as React from "react";
import {DataContainer, DataContainerStatus} from "./DataContext";
import {getCubaREST} from "../app/CubaAppProvider";

export class DataCollectionStore<T> implements DataContainer {

  @observable items: Array<SerializedEntity<T>> = [];
  @observable status: DataContainerStatus = "CLEAN";
  @observable view: string;
  @observable sort?: string;
  @observable filter?: EntityFilter;
  @observable limit?: number;
  @observable offset?: number;
  @observable count?: number;
  @observable skipCount?: boolean;

  changedItems: IObservableArray<any> = observable([]);


  constructor(public readonly entityName: string,
              public readonly trackChanges = false,
              viewName: string = PredefinedView.MINIMAL,
              sort: string | undefined = undefined) {
    this.view = viewName;
    if (sort) {
      this.sort = sort;
    }

    if (this.trackChanges) {
      reaction(
        () => [this.items, this.items.length],
        () => {
          this.changedItems.push(this.items)
        }
      )
    }
  }

  @action
  load = (): Promise<void> => {
    this.changedItems.clear();
    this.status = "LOADING";

    let loadingPromise;

    if (this.filter) {
      loadingPromise = this.handleLoadingWithCount(getCubaREST()!.searchEntitiesWithCount<T>(this.entityName, this.filter, this.entitiesLoadOptions));
    } else if (this.skipCount === true) {
      loadingPromise = this.handleLoadingNoCount(getCubaREST()!.loadEntities<T>(this.entityName, this.entitiesLoadOptions));
    } else {
      loadingPromise = this.handleLoadingWithCount(getCubaREST()!.loadEntitiesWithCount<T>(this.entityName, this.entitiesLoadOptions));
    }

    loadingPromise.catch(() => runInAction(() => this.status = 'ERROR'));

    return loadingPromise;
  };

  @action
  clear = () => {
    this.items = [];
    this.changedItems.clear();
    this.status = 'CLEAN';
  };

  @action
  delete = (e: T & {id?: string}): Promise<any> => {
    if (e == null || e.id == null) {
      throw new Error('Unable to delete entity without ID');
    }
    this.status = 'LOADING';
    return getCubaREST()!.deleteEntity(this.entityName, e.id)
      .then(action(() => {
        this.load();
        return true;
      }))
      .catch(action(() => {
        this.status = "DONE";
        return true;
      }));
  };

  @computed
  get readOnlyItems(): Array<SerializedEntity<T>> {
    return toJS(this.items)
  }

  @computed // todo will be reworked as part of https://github.com/cuba-platform/frontend/issues/4
  get properties(): string[] {
    return [];
  }

  private get entitiesLoadOptions() {
    const loadOptions: EntitiesLoadOptions = {
      view: this.view,
    };
    if (this.sort) {
      loadOptions.sort = this.sort;
    }
    if (this.limit !== null && this.limit !== undefined) {
      loadOptions.limit = this.limit;
    }
    if (this.offset !== null && this.offset !== undefined) {
      loadOptions.offset = this.offset;
    }
    return loadOptions;
  }

  private handleLoadingWithCount(promise: Promise<EntitiesWithCount<T>>) {
    return promise
      .then((resp) => {
        runInAction(() => {
          this.items = resp.result;
          this.count = resp.count;
          this.status = 'DONE';
        })
      })
  }

  private handleLoadingNoCount(promise: Promise<Array<SerializedEntity<T>>>) {
    return promise
      .then((resp: Array<SerializedEntity<T>>) => {
        runInAction(() => {
          this.items = resp;
          this.count = undefined;
          this.status = 'DONE';
        })
      })
  }
}

export interface DataCollectionOptions {
  loadImmediately?: boolean,
  view?: string,
  sort?: string,
  limit?: number,
  offset?: number,
  filter?: EntityFilter,
  trackChanges?: boolean
}

export const defaultOpts: DataCollectionOptions = {
  loadImmediately: true
};

function createStore<E>(entityName: string, opts: DataCollectionOptions): DataCollectionStore<E> {
  const dataCollection = new DataCollectionStore<E>(entityName, !!opts.trackChanges);
  if (opts.view) {
    dataCollection.view = opts.view;
  }
  if (opts.filter) {
    dataCollection.filter = opts.filter;
  }
  if (opts.sort) {
    dataCollection.sort = opts.sort;
  }
  if (opts.limit !== null && opts.limit !== undefined) {
    dataCollection.limit = opts.limit;
  }
  if (opts.offset !== null && opts.offset !== undefined) {
    dataCollection.offset = opts.offset;
  }
  if (typeof opts.loadImmediately === 'undefined' || opts.loadImmediately) {
    dataCollection.load();
  }
  return dataCollection;
}

// todo will be reworked as part of https://github.com/cuba-platform/frontend/issues/4
export const withDataCollection = (entityName: string, opts: DataCollectionOptions = defaultOpts) => <T extends IReactComponent>(target: T) => {
  return inject(() => {
    const dataCollection = createStore(entityName, opts);
    return {dataCollection}
  })(target);
};

export const collection = <E extends {}>(entityName: string, opts: DataCollectionOptions = defaultOpts) => {
  return createStore<E>(entityName, opts);
};

// todo will be reworked as part of https://github.com/cuba-platform/frontend/issues/4
export interface DataCollectionInjected<E> {
  dataCollection?: DataCollectionStore<E>
}

export interface DataCollectionProps<E> extends DataCollectionOptions {
  entityName: string
  children?: (store: Partial<DataCollectionStore<E>>) => React.ReactNode;
}

@observer
export class Collection<E> extends React.Component<DataCollectionProps<E>> {

  @observable store: DataCollectionStore<E>;

  constructor(props: DataCollectionProps<E>) {
    super(props);
    this.store = createStore(this.props.entityName, this.props);
    this.store.load();
  }

  render() {
    return !!this.props.children && this.props.children(this.childrenProps);
  }

  @computed
  get childrenProps() {
    const {items, status, load, clear} = this.store;
    return {...{items, status, load, clear}};
  }
}
