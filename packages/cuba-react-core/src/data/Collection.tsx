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
import {sortEntityInstances} from '../util/collation';

export interface DataCollectionStore<T> extends DataContainer {
  items: Array<SerializedEntity<T>>;
  readonly readOnlyItems: Array<SerializedEntity<T>>;
  readonly properties: string[];
  view: string;
  sort?: string;
  filter?: EntityFilter;
  limit?: number;
  offset?: number;
  count?: number;
  skipCount?: boolean;
  load: () => Promise<void>;
  clear: () => void;
  delete: (e: T & {id?: string}) => Promise<any>;
}

export interface ClientSideDataCollectionStore<T> extends DataCollectionStore<T> {
  allItems: Array<SerializedEntity<T>>;
  adjustItems: () => void;
}

class DataCollectionStoreImpl<T> implements DataCollectionStore<T> {

  @observable items: Array<SerializedEntity<T>> = [];
  @observable status: DataContainerStatus = "CLEAN";
  @observable view: string;
  @observable sort?: string;
  @observable filter?: EntityFilter;
  @observable limit?: number;
  @observable offset?: number;
  @observable count?: number;
  @observable skipCount?: boolean;

  allItems: Array<SerializedEntity<T>> = []; // Client mode only

  changedItems: IObservableArray<any> = observable([]);

  constructor(public readonly entityName: string,
              public readonly trackChanges = false,
              viewName: string = PredefinedView.MINIMAL,
              sort?: string) {
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

class ClientSideDataCollectionStoreImpl<T> extends DataCollectionStoreImpl<T> implements ClientSideDataCollectionStore<T> {
  allItems: Array<SerializedEntity<T>> = [];

  constructor(public readonly entityName: string,
              public readonly trackChanges = false,
              viewName: string = PredefinedView.MINIMAL,
              sort?: string) {
    super(entityName, trackChanges, viewName, sort);
  }

  @action
  load = (): Promise<void> => {
    this.adjustItems();
    return Promise.resolve();
  };

  @action
  adjustItems = () => {
    // Currently only sorts the items. Client-side filtering can be implemented here:
    // const filteredItems = filterEntityInstances([...this.allItems], this.filter);
    this.items = sortEntityInstances([...this.allItems], this.sort);
  };

  @action
  delete = (e: T & {id?: string}): Promise<any> => {
    this.allItems = this.allItems.filter((item: T & {id?: string}) => (item != null && item.id !== e.id));
    this.adjustItems();
    return Promise.resolve();
  };
}

export interface DataCollectionOptions {
  loadImmediately?: boolean,
  view?: string,
  sort?: string,
  limit?: number,
  offset?: number,
  filter?: EntityFilter,
  trackChanges?: boolean,
}

export interface ClientSideDataCollectionOptions extends DataCollectionOptions {
  allItems?: Array<SerializedEntity<any>>;
}

export const defaultOpts: DataCollectionOptions = {
  loadImmediately: true
};

function createStore<E>(entityName: string, opts: DataCollectionOptions): DataCollectionStore<E> {
  const dataCollection = new DataCollectionStoreImpl<E>(entityName, !!opts.trackChanges);
  setOptionsAndLoad(dataCollection, opts);
  return dataCollection;
}

function createClientSideStore<E>(entityName: string, opts: ClientSideDataCollectionOptions): ClientSideDataCollectionStore<E> {
  const dataCollection = new ClientSideDataCollectionStoreImpl<E>(entityName, !!opts.trackChanges);
  if (opts.allItems != null) {
    dataCollection.allItems = opts.allItems;
  }
  setOptionsAndLoad(dataCollection, opts);
  return dataCollection;
}

function setOptionsAndLoad<E>(dataCollection: DataCollectionStore<E>, opts: DataCollectionOptions) {
  if (opts.view != null) {
    dataCollection.view = opts.view;
  }
  if (opts.filter != null) {
    dataCollection.filter = opts.filter;
  }
  if (opts.sort != null) {
    dataCollection.sort = opts.sort;
  }
  if (opts.limit != null) {
    dataCollection.limit = opts.limit;
  }
  if (opts.offset != null) {
    dataCollection.offset = opts.offset;
  }
  if (typeof opts.loadImmediately === 'undefined' || opts.loadImmediately) {
    dataCollection.load();
  }
}

// todo will be reworked as part of https://github.com/cuba-platform/frontend/issues/4
export const withDataCollection = (entityName: string, opts: DataCollectionOptions = defaultOpts) => <T extends IReactComponent>(target: T) => {
  return inject(() => {
    const dataCollection = createStore(entityName, opts);
    return {dataCollection}
  })(target);
};

export const collection = <E extends {}>(entityName: string, opts: DataCollectionOptions = defaultOpts): DataCollectionStore<E> => {
  return createStore<E>(entityName, opts);
};

export const clientSideCollection = <E extends {}>(
  entityName: string, opts: ClientSideDataCollectionOptions = defaultOpts
): ClientSideDataCollectionStore<E> => {
  return createClientSideStore<E>(entityName, opts);
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
