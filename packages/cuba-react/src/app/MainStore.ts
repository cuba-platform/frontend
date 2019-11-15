import {action, autorun, computed, IObservableArray, observable} from "mobx";
import {CubaApp, EntityMessages, EnumInfo, MetaClassInfo, PermissionInfo, UserInfo} from "@cuba-platform/rest";
import {inject, IReactComponent, IWrappedComponent} from "mobx-react";
import * as moment from 'moment';

export class MainStore {

  static NAME = 'mainStore';

  @observable initialized = false;
  @observable authenticated = false;
  @observable usingAnonymously = false;
  @observable userName?: string;
  @observable locale?: string;

  @observable permissions?: IObservableArray<PermissionInfo>;
  permissionsRequestCount = 0;
  @observable metadata?: IObservableArray<MetaClassInfo>;
  metadataRequestCount = 0;
  @observable messages?: EntityMessages;
  messagesRequestCount = 0;
  @observable enums?: IObservableArray<EnumInfo>;
  enumsRequestCount = 0;

  constructor(private cubaREST: CubaApp) {
    this.cubaREST.onLocaleChange(this.handleLocaleChange);

    autorun(() => {
      if (this.initialized && (this.authenticated || this.usingAnonymously)) {
        this.loadPermissions();
        this.loadEnums();
        this.loadMetadata();
        this.loadMessages();
      }
    })
  }

  @action
  loadPermissions() {
    const requestId = ++this.permissionsRequestCount;
    this.cubaREST.getPermissions()
      .then(action((perms: PermissionInfo[]) => {
        if (requestId === this.permissionsRequestCount) {
          this.permissions = observable(perms);
        }
      }));
  }

  @action
  loadEnums() {
    const requestId = ++this.enumsRequestCount;
    this.cubaREST.loadEnums()
      .then(action((enums: EnumInfo[]) => {
        if (requestId === this.enumsRequestCount) {
          this.enums = observable(enums);
        }
      }));
  }

  @action
  loadMetadata() {
    const requestId = ++this.metadataRequestCount;
    this.cubaREST.loadMetadata()
      .then(action((metadata: MetaClassInfo[]) => {
        if (requestId === this.metadataRequestCount) {
          this.metadata = observable(metadata);
        }
      }));
  }

  @action
  loadMessages() {
    const requestId = ++this.messagesRequestCount;
    this.cubaREST.loadEntitiesMessages()
      .then(action((res: EntityMessages) => {
        if (requestId === this.messagesRequestCount) {
          this.messages = res;
        }
      }))
  }

  setLocale = (locale: string) => {
    this.cubaREST.locale = locale;
  };

  @action
  handleLocaleChange = (locale: string) => {
    this.locale = locale;

    // We need to set locale for moment since antd uses moment's localized messages in e.g. Calendar or DatePicker
    moment.locale(locale);

    if (this.initialized && (this.authenticated || this.usingAnonymously)) {
      this.loadEnums();
      this.loadMessages();
    }

    if (this.initialized && this.authenticated) {
      this.setSessionLocale();
    }
  };

  setSessionLocale = () => {
    // noinspection JSIgnoredPromiseFromCall
    this.cubaREST.setSessionLocale();
  };

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
    this.locale = this.cubaREST.locale;
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
