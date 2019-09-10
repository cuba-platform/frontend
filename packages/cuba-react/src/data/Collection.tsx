import {action, computed, IObservableArray, observable, reaction, runInAction, toJS} from "mobx";
import {EntitiesLoadOptions, EntityFilter, PredefinedView, SerializedEntity} from "@cuba-platform/rest";
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
        () => (this.items.length),
        () => {
          this.changedItems.push(this.items)
        }
      )
    }
  }

  @action
  load = () => {
    this.items = [];
    this.changedItems.clear();
    this.status = "LOADING";
    if (this.filter) {
      this.handleLoading(getCubaREST()!.searchEntities<T>(this.entityName, this.filter, this.entitiesLoadOptions));
    } else {
      this.handleLoading(getCubaREST()!.loadEntities<T>(this.entityName, this.entitiesLoadOptions));
    }
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

  @computed // todo
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
    return loadOptions;
  }

  private handleLoading(promise: Promise<any[]>) {
    promise
      .then((resp) => {
        runInAction(() => {
          this.items = resp;
          this.status = 'DONE';
        })
      })
      .catch(() => {
        runInAction(() => {
          this.status = 'ERROR'
        })
      })
  }
}

export interface DataCollectionOptions {
  loadImmediately?: boolean,
  view?: string,
  sort?: string,
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
  if (typeof opts.loadImmediately === 'undefined' || opts.loadImmediately) {
    dataCollection.load();
  }
  return dataCollection;
}

export const withDataCollection = (entityName: string, opts: DataCollectionOptions = defaultOpts) => <T extends IReactComponent>(target: T) => {
  return inject(() => {
    const dataCollection = createStore(entityName, opts);
    return {dataCollection}
  })(target);
};

export const collection = <E extends {}>(entityName: string, opts: DataCollectionOptions = defaultOpts) => {
  return createStore<E>(entityName, opts);
};

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
    if (!this.props.children) {
      return null;
    }
    return this.props.children(this.childrenProps);
  }

  @computed
  get childrenProps() {
    const {items, status, load, clear} = this.store;
    return {...{items, status, load, clear}};
  }
}
