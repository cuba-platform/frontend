import {action, autorun, computed, IObservableArray, observable} from "mobx";
import {CubaApp, EntityMessages, EnumInfo, MetaClassInfo, UserInfo} from "@cuba-platform/rest";
import {inject, IReactComponent, IWrappedComponent} from "mobx-react";
import {Security} from './Security';

export class MainStore {

  static NAME = 'mainStore';

  @observable initialized = false;
  @observable authenticated = false;
  @observable usingAnonymously = false;
  @observable userName?: string;
  @observable locale?: string;

  @observable metadata?: IObservableArray<MetaClassInfo>;
  metadataRequestCount = 0;
  @observable messages?: EntityMessages;
  messagesRequestCount = 0;
  @observable enums?: IObservableArray<EnumInfo>;
  enumsRequestCount = 0;
  security: Security;

  constructor(private cubaREST: CubaApp) {
    this.cubaREST.onLocaleChange(this.handleLocaleChange);
    this.security = new Security(this.cubaREST);

    autorun(() => {
      if (this.initialized && (this.authenticated || this.usingAnonymously)) {
        this.security.loadPermissions();
        this.loadEnums();
        this.loadMetadata();
        this.loadMessages();
      }
    })
  }

  isEntityDataLoaded(): boolean {
    return !!this.messages && !!this.metadata && !!this.enums && this.security.dataLoaded;
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

    if (this.initialized && (this.authenticated || this.usingAnonymously)) {
      this.loadEnums();
      this.loadMessages();
    }

    if (this.initialized && this.authenticated) {
      this.setSessionLocale();
    }
  };

  setSessionLocale = () => {
    this.cubaREST.setSessionLocale().catch((reason) => {
      if (reason === CubaApp.NOT_SUPPORTED_BY_API_VERSION) {
        console.warn('Relogin is required in order for bean validation messages to use correct locale. ' +
              'Upgrade to REST API 7.2.0 or higher to be able to change locale without relogin.');
      } else {
        throw new Error('Failed to set session locale');
      }
    });
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

  initialize(): Promise<void> {
    this.locale = this.cubaREST.locale;
    return this.cubaREST.getUserInfo()
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
