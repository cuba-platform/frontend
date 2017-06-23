module cuba {

    const apps: CubaApp[] = [];

    export interface AppConfig {
        apiUrl: string,
        name?: string,
        restClientId?: string,
        restClientSecret?: string,
        defaultLocale?: string
    }

    export interface IResponseError extends Error {
        response?: any;
    }
    export type ContentType = 'text' | 'json' | 'blob';

    export interface IFetchOptions extends RequestInit {
        handleAs?: ContentType
    }

    export function initializeApp(config: AppConfig): CubaApp {
        if (getApp(config.name) != null) {
            throw new Error("Cuba app is already initialized");
        }
        let cubaApp = new CubaApp(config.name, config.apiUrl, config.restClientId, config.restClientSecret, config.defaultLocale);
        apps.push(cubaApp);
        return cubaApp;
    }

    export function getApp(appName?: string): CubaApp {
        const nameToSearch = appName == null ? "" : appName;
        for (let i = 0; i < apps.length; i++) {
            if (apps[i].name === nameToSearch) {
                return apps[i];
            }
        }
        return null;
    }

    export class CubaApp {

        static REST_TOKEN_STORAGE_KEY = 'cubaAccessToken';
        static USER_NAME_STORAGE_KEY = 'cubaUserName';
        static LOCALE_STORAGE_KEY = 'cubaLocale';

        public messagesCache: any[];
        public enumsCache: any[];

        private tokenExpiryListeners: (() => {})[] = [];
        private messagesLoadingListeners: ((messages: any[]) => {})[] = [];
        private enumsLoadingListeners: ((enums: any[]) => {})[] = [];
        private localeChangeListeners: ((locale: string) => {})[] = [];

        constructor(public name = "",
                    public apiUrl = '/app/rest/',
                    public restClientId = 'client',
                    public restClientSecret = 'secret',
                    public defaultLocale = 'en') {
        }

        get restApiToken(): string {
            return localStorage.getItem(this.name + "_" + CubaApp.REST_TOKEN_STORAGE_KEY);
        }

        set restApiToken(token: string) {
            localStorage.setItem(this.name + "_" + CubaApp.REST_TOKEN_STORAGE_KEY, token);
        }

        get locale(): string {
            let storedLocale = localStorage.getItem(this.name + "_" + CubaApp.LOCALE_STORAGE_KEY);
            return storedLocale ? storedLocale : this.defaultLocale;
        }

        set locale(locale: string) {
            localStorage.setItem(this.name + "_" + CubaApp.LOCALE_STORAGE_KEY, locale);
            this.localeChangeListeners.forEach((l) => l(this.locale));
        }

        login(login: string, password: string): Promise<{ access_token: string }> {
            if (login == null) login = '';
            if (password == null) password = '';
            let fetchOptions = {
                method: 'POST',
                headers: this._getBasicAuthHeaders(),
                body: 'grant_type=password&username=' + encodeURIComponent(login) + '&password=' + encodeURIComponent(password)
            };
            let loginRes = fetch(this.apiUrl + 'v2/oauth/token', fetchOptions)
                .then(this.checkStatus)
                .then((resp) => resp.json())
                .then((data) => {
                    this.restApiToken = data.access_token;
                    return data;
                });
            return loginRes;
        }

        logout(): Promise<any> {
            let fetchOptions = {
                method: 'POST',
                headers: this._getBasicAuthHeaders(),
                body: "token=" + encodeURIComponent(this.restApiToken),
            };
            this.clearAuthData();
            return fetch(this.apiUrl + 'v2/oauth/revoke', fetchOptions).then(this.checkStatus);
        }

        loadEntities(entityName, options?: { view?: string, sort?: string, limit?: number, offset?: number }): Promise<any[]> {
            return this.fetch('GET', 'v2/entities/' + entityName, options, {handleAs: 'json'});
        }

        loadEntity(entityName, id, options?: { view?: string }): Promise<any> {
            return this.fetch('GET', 'v2/entities/' + entityName + '/' + id, options, {handleAs: 'json'});
        }

        deleteEntity(entityName, id): Promise<any> {
            return this.fetch('DELETE', 'v2/entities/' + entityName + '/' + id);
        }

        commitEntity(entityName: string, entity: any): Promise<any> {
            if (entity.id) {
                return this.fetch('PUT', 'v2/entities/' + entityName + '/' + entity.id, JSON.stringify(entity), {handleAs: 'json'});
            } else {
                return this.fetch('POST', 'v2/entities/' + entityName, JSON.stringify(entity), {handleAs: 'json'});
            }
        }

        invokeService(serviceName: string, methodName: string, params: any, fetchOptions?: IFetchOptions): Promise<any> {
            return this.fetch('POST', 'v2/services/' + serviceName + '/' + methodName, JSON.stringify(params), fetchOptions);
        }

        query(entityName: string, queryName: string, params?: any): Promise<any> {
            return this.fetch('GET', 'v2/queries/' + entityName + '/' + queryName, params, {handleAs: 'json'});
        }

        queryCount(entityName: string, queryName: string, params?: any): Promise<any> {
            return this.fetch('GET', 'v2/queries/' + entityName + '/' + queryName + '/count', params);
        }

        loadMetadata(): Promise<any> {
            return this.fetch('GET', 'v2/metadata/entities', null, {handleAs: 'json'});
        }

        loadEntityMetadata(entityName: string): Promise<any> {
            return this.fetch('GET', 'v2/metadata/entities' + '/' + entityName, null, {handleAs: 'json'});
        }

        loadEntitiesMessages(): Promise<any> {
            let fetchRes = this.fetch('GET', 'v2/messages/entities', null, {handleAs: 'json'});
            fetchRes.then((messages) => {
                this.messagesCache = messages;
                this.messagesLoadingListeners.forEach(l => l(messages));
            });
            return fetchRes;
        }

        loadEnums(): Promise<any> {
            let fetchRes = this.fetch('GET', 'v2/metadata/enums', null, {handleAs: 'json'});
            fetchRes.then((enums) => {
                this.enumsCache = enums;
                this.enumsLoadingListeners.forEach(l => l(enums));
            });
            return fetchRes;
        }

        getPermissions(): Promise<any> {
            return this.fetch('GET', 'v2/permissions', null, {handleAs: 'json'});
        }

        getUserInfo(): Promise<any> {
            return this.fetch('GET', 'v2/userInfo', null, {handleAs: 'json'});
        }

        private _getBasicAuthHeaders(): { [header: string]: string } {
            return {
                "Accept-Language": this.locale,
                "Authorization": "Basic " + btoa(this.restClientId + ':' + this.restClientSecret),
                "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
            };
        }

        private clearAuthData(): void {
            localStorage.removeItem(this.name + "_" + CubaApp.REST_TOKEN_STORAGE_KEY);
            localStorage.removeItem(this.name + "_" + CubaApp.USER_NAME_STORAGE_KEY);
        }

        fetch(method, path, data?, fetchOptions?: IFetchOptions): Promise<any> {
            let url = this.apiUrl + path;
            let settings: RequestInit = {
                method: method,
                headers: {
                    "Accept-Language": this.locale
                }
            };
            if (this.restApiToken) {
                settings.headers["Authorization"] = "Bearer " + this.restApiToken
            }
            if (method == 'POST' || method == 'PUT') {
                settings.body = data;
                settings.headers["Content-Type"] = "application/json; charset=UTF-8";
            }
            if (method == 'GET' && data && Object.keys(data).length > 0) {
                url += '?' + Object.keys(data)
                        .map(k => {
                            return encodeURIComponent(k) + "=" + (data[k] != null ? encodeURIComponent(data[k]) : '');
                        }).join("&");
            }
            let handleAs: ContentType = fetchOptions ? fetchOptions.handleAs : undefined;
            switch (handleAs) {
                case "text":
                    settings.headers["Accept"] = "text/html";
                    break;
                case "json":
                    settings.headers["Accept"] = "application/json";
                    break;
            }

            let fetchRes = fetch(url, settings).then(this.checkStatus);

            fetchRes.catch((error) => {
                if (CubaApp.isTokenExpiredResponse(error.response)) {
                    this.clearAuthData();
                    this.tokenExpiryListeners.forEach((l) => l());
                }
            });

            return fetchRes.then((resp) => {

                if(resp.status === 204){
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

        onLocaleChange(c) {
            this.localeChangeListeners.push(c);
            return () => this.localeChangeListeners.splice(this.localeChangeListeners.indexOf(c), 1);
        }

        onTokenExpiry(c) {
            this.tokenExpiryListeners.push(c);
            return () => this.tokenExpiryListeners.splice(this.tokenExpiryListeners.indexOf(c), 1);
        }

        onEnumsLoaded(c) {
            this.enumsLoadingListeners.push(c);
            return () => this.enumsLoadingListeners.splice(this.enumsLoadingListeners.indexOf(c), 1);
        }

        onMessagesLoaded(c) {
            this.messagesLoadingListeners.push(c);
            return () => this.messagesLoadingListeners.splice(this.messagesLoadingListeners.indexOf(c), 1);
        }

        checkStatus(response: Response): any {
            if (response.status >= 200 && response.status < 300) {
                return response;
            } else {
                return Promise.reject({message: response.statusText, response: response});
            }
        }


        static isTokenExpiredResponse(resp: Response): boolean {
            return resp && resp.status === 401;
            // && resp.responseJSON
            // && resp.responseJSON.error === 'invalid_token';
        }
    }
}