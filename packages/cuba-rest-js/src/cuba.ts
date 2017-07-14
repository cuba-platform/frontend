namespace cuba {

  const apps: CubaApp[] = [];

  export interface IAppConfig {
    apiUrl: string;
    name?: string;
    restClientId?: string;
    restClientSecret?: string;
    defaultLocale?: string;
  }

  export interface IResponseError extends Error {
    response?: any;
  }
  export type ContentType = "text" | "json" | "blob";

  export interface IFetchOptions extends RequestInit {
    handleAs?: ContentType;
  }

  export interface IEntitiesLoadOptions {
    view?: string;
    sort?: string;
    limit?: number;
    offset?: number;
  }

  export function initializeApp(config?: IAppConfig): CubaApp {

    if (getApp(config.name) != null) {
      throw new Error("Cuba app is already initialized");
    }
    const cubaApp = new CubaApp(config.name, config.apiUrl, config.restClientId, config.restClientSecret,
      config.defaultLocale);
    apps.push(cubaApp);
    return cubaApp;
  }

  export function getApp(appName?: string): CubaApp {
    const nameToSearch = appName == null ? "" : appName;
    for (const app of apps) {
      if (app.name === nameToSearch) {
        return app;
      }
    }
    return null;
  }

  export class CubaApp {

    private static REST_TOKEN_STORAGE_KEY = "cubaAccessToken";
    private static USER_NAME_STORAGE_KEY = "cubaUserName";
    private static LOCALE_STORAGE_KEY = "cubaLocale";

    public messagesCache: any[];
    public enumsCache: any[];

    private tokenExpiryListeners: Array<(() => {})> = [];
    private messagesLoadingListeners: Array<((messages: any[]) => {})> = [];
    private enumsLoadingListeners: Array<((enums: any[]) => {})> = [];
    private localeChangeListeners: Array<((locale: string) => {})> = [];

    constructor(public apiUrl = "/app/rest/",
                public restClientId = "client",
                public restClientSecret = "secret",
                public defaultLocale = "en") {
    }

    get restApiToken(): string {
      return localStorage.getItem(this.name + "_" + CubaApp.REST_TOKEN_STORAGE_KEY);
    }

    set restApiToken(token: string) {
      localStorage.setItem(this.name + "_" + CubaApp.REST_TOKEN_STORAGE_KEY, token);
    }

    get locale(): string {
      const storedLocale = localStorage.getItem(this.name + "_" + CubaApp.LOCALE_STORAGE_KEY);
      return storedLocale ? storedLocale : this.defaultLocale;
    }

    set locale(locale: string) {
      localStorage.setItem(this.name + "_" + CubaApp.LOCALE_STORAGE_KEY, locale);
      this.localeChangeListeners.forEach((l) => l(this.locale));
    }

    public login(login: string, password: string): Promise<{ access_token: string }> {
      if (login == null) {
        login = "";
      }
      if (password == null) {
        password = "";
      }
      const fetchOptions = {
        method: "POST",
        headers: this._getBasicAuthHeaders(),
        body: "grant_type=password&username=" + encodeURIComponent(login) + "&password=" + encodeURIComponent(password),
      };
      const loginRes = fetch(this.apiUrl + "v2/oauth/token", fetchOptions)
        .then(this.checkStatus)
        .then((resp) => resp.json())
        .then((data) => {
          this.restApiToken = data.access_token;
          return data;
        });
      return loginRes;
    }

    public logout(): Promise<any> {
      const fetchOptions = {
        method: 'POST',
        headers: this._getBasicAuthHeaders(),
        body: 'token=' + encodeURIComponent(this.restApiToken),
      };
      this.clearAuthData();
      return fetch(this.apiUrl + 'v2/oauth/revoke', fetchOptions).then(this.checkStatus);
    }

    public loadEntities(entityName, options?: IEntitiesLoadOptions): Promise<any[]> {
      return this.fetch('GET', 'v2/entities/' + entityName, options, {handleAs: 'json'});
    }

    public loadEntity(entityName, id, options?: { view?: string }): Promise<any> {
      return this.fetch('GET', 'v2/entities/' + entityName + '/' + id, options, {handleAs: 'json'});
    }

    public deleteEntity(entityName, id): Promise<any> {
      return this.fetch('DELETE', 'v2/entities/' + entityName + '/' + id);
    }

    public commitEntity(entityName: string, entity: any): Promise<any> {
      if (entity.id) {
        return this.fetch('PUT', 'v2/entities/' + entityName + '/' + entity.id, JSON.stringify(entity),
          {handleAs: 'json'});
      } else {
        return this.fetch('POST', 'v2/entities/' + entityName, JSON.stringify(entity), {handleAs: 'json'});
      }
    }

    public invokeService(serviceName: string, methodName: string, params: any,
                         fetchOptions?: IFetchOptions): Promise<any> {
      return this.fetch('POST', 'v2/services/' + serviceName + '/' + methodName, JSON.stringify(params), fetchOptions);
    }

    public query(entityName: string, queryName: string, params?: any): Promise<any> {
      return this.fetch('GET', 'v2/queries/' + entityName + '/' + queryName, params, {handleAs: 'json'});
    }

    public queryCount(entityName: string, queryName: string, params?: any): Promise<any> {
      return this.fetch('GET', 'v2/queries/' + entityName + '/' + queryName + '/count', params);
    }

    public loadMetadata(): Promise<any> {
      return this.fetch('GET', 'v2/metadata/entities', null, {handleAs: 'json'});
    }

    public loadEntityMetadata(entityName: string): Promise<any> {
      return this.fetch('GET', 'v2/metadata/entities' + '/' + entityName, null, {handleAs: 'json'});
    }

    public loadEntitiesMessages(): Promise<any> {
      const fetchRes = this.fetch('GET', 'v2/messages/entities', null, {handleAs: 'json'});
      fetchRes.then((messages) => {
        this.messagesCache = messages;
        this.messagesLoadingListeners.forEach((l) => l(messages));
      });
      return fetchRes;
    }

    public loadEnums(): Promise<any> {
      const fetchRes = this.fetch('GET', 'v2/metadata/enums', null, {handleAs: 'json'});
      fetchRes.then((enums) => {
        this.enumsCache = enums;
        this.enumsLoadingListeners.forEach((l) => l(enums));
      });
      return fetchRes;
    }

    public getPermissions(): Promise<any> {
      return this.fetch('GET', 'v2/permissions', null, {handleAs: 'json'});
    }

    public getUserInfo(): Promise<any> {
      return this.fetch('GET', 'v2/userInfo', null, {handleAs: 'json'});
    }

    public fetch(method, path, data?, fetchOptions?: IFetchOptions): Promise<any> {
      let url = this.apiUrl + path;
      const settings: RequestInit = {
        method,
        headers: {
          "Accept-Language": this.locale,
        },
      };
      if (this.restApiToken) {
        settings.headers.authorization = "Bearer " + this.restApiToken;
      }
      if (method === 'POST' || method === 'PUT') {
        settings.body = data;
        settings.headers["Content-Type"] = "application/json; charset=UTF-8";
      }
      if (method === 'GET' && data && Object.keys(data).length > 0) {
        url += '?' + Object.keys(data)
            .map((k) => {
              return encodeURIComponent(k) + "=" + (data[k] != null ? encodeURIComponent(data[k]) : '');
            }).join("&");
      }
      const handleAs: ContentType = fetchOptions ? fetchOptions.handleAs : undefined;
      switch (handleAs) {
        case "text":
          settings.headers.accept = "text/html";
          break;
        case "json":
          settings.headers.accept = "application/json";
          break;
      }

      const fetchRes = fetch(url, settings).then(this.checkStatus);

      fetchRes.catch((error) => {
        if (this.isTokenExpiredResponse(error.response)) {
          this.clearAuthData();
          this.tokenExpiryListeners.forEach((l) => l());
        }
      });

      return fetchRes.then((resp) => {

        if (resp.status === 204) {
          return resp.text();
        }

        switch (handleAs) {
          case "text":
            return resp.text();
          case "blob":
            return resp.blob();
          case "json":
            return resp.json();
          default:
            return resp.text();
        }
      });
    }

    public onLocaleChange(c) {
      this.localeChangeListeners.push(c);
      return () => this.localeChangeListeners.splice(this.localeChangeListeners.indexOf(c), 1);
    }

    public onTokenExpiry(c) {
      this.tokenExpiryListeners.push(c);
      return () => this.tokenExpiryListeners.splice(this.tokenExpiryListeners.indexOf(c), 1);
    }

    public onEnumsLoaded(c) {
      this.enumsLoadingListeners.push(c);
      return () => this.enumsLoadingListeners.splice(this.enumsLoadingListeners.indexOf(c), 1);
    }

    public onMessagesLoaded(c) {
      this.messagesLoadingListeners.push(c);
      return () => this.messagesLoadingListeners.splice(this.messagesLoadingListeners.indexOf(c), 1);
    }

    private isTokenExpiredResponse(resp: Response): boolean {
      return resp && resp.status === 401;
      // && resp.responseJSON
      // && resp.responseJSON.error === 'invalid_token';
    }

    private _getBasicAuthHeaders(): { [header: string]: string } {
      return {
        "Accept-Language": this.locale,
        "Authorization": "Basic " + base64encode(this.restClientId + ':' + this.restClientSecret),
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
      };
    }

    private checkStatus(response: Response): any {
      if (response.status >= 200 && response.status < 300) {
        return response;
      } else {
        return Promise.reject({message: response.statusText, response});
      }
    }

    private clearAuthData(): void {
      localStorage.removeItem(this.name + "_" + CubaApp.REST_TOKEN_STORAGE_KEY);
      localStorage.removeItem(this.name + "_" + CubaApp.USER_NAME_STORAGE_KEY);
    }

  }
  declare const Buffer;
  declare const global;
  function base64encode(str) {
    if (typeof btoa === 'function') {
      return btoa(str);
    } else if (global['Buffer']) { // prevent Buffer from being injected by browserify
      return new global['Buffer'](str).toString('base64');
    } else {
      throw new Error('Unable to encode to base64');
    }
  }
}

export = cuba;
