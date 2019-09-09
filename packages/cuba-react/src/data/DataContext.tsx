import {action, computed, IObservableArray, observable} from "mobx";
import {getCubaREST} from "../app/CubaAppProvider";

export interface DataContainer {
  entityName: string;
  changedItems: IObservableArray;
  status: DataContainerStatus
}

export type DataContainerStatus = 'CLEAN' | 'LOADING' | 'DONE' | 'ERROR';

export interface Containers {
  [containerId: string]: DataContainer;
}

class DataContext<T extends Containers> {

  @observable containers: T;

  constructor(containers: T) {
    this.containers = containers;
  }

  @action
  save = () => {
    for (const containerName in this.containers) {
      if (!this.containers.hasOwnProperty(containerName)) {
        continue;
      }
      const container = this.containers[containerName];
      container.changedItems.forEach((entity) => {
        getCubaREST()!.commitEntity(container.entityName, entity);
      })
    }
  };

  @computed
  get hasChanges(): boolean {
    if (!this.containers || Object.getOwnPropertyNames(this.containers).length < 1) {
      return false;
    }
    for (const containerName in this.containers) {
      if (!this.containers.hasOwnProperty(containerName)) {
        continue;
      }
      if (this.containers[containerName].changedItems != null && this.containers[containerName].changedItems.length > 0) {
        return true;
      }
    }
    return false;
  }
}


export function data<T extends Containers>(containers: T): DataContext<T> {
  return new DataContext<T>(containers);
}
