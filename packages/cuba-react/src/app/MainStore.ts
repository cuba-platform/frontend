import {action, autorun, computed, IObservableArray, observable} from "mobx";
import {CubaApp, EntityMessages, EnumInfo, MetaClassInfo, PermissionInfo, UserInfo} from "@cuba-platform/rest";
import {inject, IReactComponent, IWrappedComponent} from "mobx-react";

// todo move to cuba-rest
export type PropertyType = 'string' | 'int' | 'date' | 'dateTime' | 'boolean';

export class MainStore {

  static NAME = 'mainStore';

  @observable initialized = false;
  @observable authenticated = false;
  @observable usingAnonymously = false;
  @observable userName?: string;

  @observable permissions?: IObservableArray<PermissionInfo>;
  @observable metadata?: IObservableArray<MetaClassInfo>;
  @observable messages?: EntityMessages;
  @observable enums?: IObservableArray<EnumInfo>;

  constructor(private cubaREST: CubaApp) {

    autorun(() => {
      if (this.initialized && (this.authenticated || this.usingAnonymously)) {
        this.cubaREST.getPermissions()
          .then(action((perms: PermissionInfo[]) => {
            this.permissions = observable(perms);
          }));

        this.cubaREST.loadEnums()
          .then(action((enums: EnumInfo[]) => {
            this.enums = observable(enums);
          }));

        this.cubaREST.loadMetadata()
          .then(action((metadata: MetaClassInfo[]) => {
            this.metadata = observable(metadata);
          }));

        this.cubaREST.loadEntitiesMessages()
          .then(action((res: {}) => {
            this.messages = res;
          }))
      }
    })
  }

  @computed get loginRequired(): boolean {
    return !this.authenticated && !this.usingAnonymously;
  }

  @action
  login(login: string, password: string) {
    return this.cubaREST.login(login, password).then(action(() => {
      this.userName = login;
      this.authenticated = true;
    }))
  }

  @action
  logout(): Promise<void> {
    if (this.usingAnonymously) {
      this.usingAnonymously = false;
      return Promise.resolve();
    }
    if (this.cubaREST.restApiToken != null) {
      return this.cubaREST.logout()
        .then(action(() => {
          this.authenticated = false;
        }));
    }
    return Promise.resolve();
  }

  initialize() {
    this.cubaREST.getUserInfo()
      .then(action((userInfo: UserInfo) => {
        if (this.cubaREST.restApiToken == null) {
          this.usingAnonymously = true;
        } else {
          this.authenticated = true;
        }
        this.userName = userInfo.name;
        this.initialized = true;
      }))
      .catch(action(() => {
        this.initialized = true;
      }));
  }
}

export interface MainStoreInjected {
  mainStore?: MainStore;
}

export function injectMainStore<T extends IReactComponent>(target: T): T & IWrappedComponent<T> {
  return inject(MainStore.NAME)(target);
}