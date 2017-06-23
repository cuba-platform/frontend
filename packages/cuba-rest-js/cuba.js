var cuba;
(function (cuba) {
    const apps = [];
    function initializeApp(config) {
        if (getApp(config.name) != null) {
            throw new Error("Cuba app is already initialized");
        }
        let cubaApp = new CubaApp(config.name, config.apiUrl, config.restClientId, config.restClientSecret, config.defaultLocale);
        apps.push(cubaApp);
        return cubaApp;
    }
    cuba.initializeApp = initializeApp;
    function getApp(appName) {
        const nameToSearch = appName == null ? "" : appName;
        for (let i = 0; i < apps.length; i++) {
            if (apps[i].name === nameToSearch) {
                return apps[i];
            }
        }
        return null;
    }
    cuba.getApp = getApp;
    class CubaApp {
        constructor(name = "", apiUrl = '/app/rest/', restClientId = 'client', restClientSecret = 'secret', defaultLocale = 'en') {
            this.name = name;
            this.apiUrl = apiUrl;
            this.restClientId = restClientId;
            this.restClientSecret = restClientSecret;
            this.defaultLocale = defaultLocale;
            this.tokenExpiryListeners = [];
            this.messagesLoadingListeners = [];
            this.enumsLoadingListeners = [];
            this.localeChangeListeners = [];
        }
        get restApiToken() {
            return localStorage.getItem(this.name + "_" + CubaApp.REST_TOKEN_STORAGE_KEY);
        }
        set restApiToken(token) {
            localStorage.setItem(this.name + "_" + CubaApp.REST_TOKEN_STORAGE_KEY, token);
        }
        get locale() {
            let storedLocale = localStorage.getItem(this.name + "_" + CubaApp.LOCALE_STORAGE_KEY);
            return storedLocale ? storedLocale : this.defaultLocale;
        }
        set locale(locale) {
            localStorage.setItem(this.name + "_" + CubaApp.LOCALE_STORAGE_KEY, locale);
            this.localeChangeListeners.forEach((l) => l(this.locale));
        }
        login(login, password) {
            if (login == null)
                login = '';
            if (password == null)
                password = '';
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
        logout() {
            let fetchOptions = {
                method: 'POST',
                headers: this._getBasicAuthHeaders(),
                body: "token=" + encodeURIComponent(this.restApiToken),
            };
            this.clearAuthData();
            return fetch(this.apiUrl + 'v2/oauth/revoke', fetchOptions).then(this.checkStatus);
        }
        loadEntities(entityName, options) {
            return this.fetch('GET', 'v2/entities/' + entityName, options, { handleAs: 'json' });
        }
        loadEntity(entityName, id, options) {
            return this.fetch('GET', 'v2/entities/' + entityName + '/' + id, options, { handleAs: 'json' });
        }
        deleteEntity(entityName, id) {
            return this.fetch('DELETE', 'v2/entities/' + entityName + '/' + id);
        }
        commitEntity(entityName, entity) {
            if (entity.id) {
                return this.fetch('PUT', 'v2/entities/' + entityName + '/' + entity.id, JSON.stringify(entity), { handleAs: 'json' });
            }
            else {
                return this.fetch('POST', 'v2/entities/' + entityName, JSON.stringify(entity), { handleAs: 'json' });
            }
        }
        invokeService(serviceName, methodName, params, fetchOptions) {
            return this.fetch('POST', 'v2/services/' + serviceName + '/' + methodName, JSON.stringify(params), fetchOptions);
        }
        query(entityName, queryName, params) {
            return this.fetch('GET', 'v2/queries/' + entityName + '/' + queryName, params, { handleAs: 'json' });
        }
        queryCount(entityName, queryName, params) {
            return this.fetch('GET', 'v2/queries/' + entityName + '/' + queryName + '/count', params);
        }
        loadMetadata() {
            return this.fetch('GET', 'v2/metadata/entities', null, { handleAs: 'json' });
        }
        loadEntityMetadata(entityName) {
            return this.fetch('GET', 'v2/metadata/entities' + '/' + entityName, null, { handleAs: 'json' });
        }
        loadEntitiesMessages() {
            let fetchRes = this.fetch('GET', 'v2/messages/entities', null, { handleAs: 'json' });
            fetchRes.then((messages) => {
                this.messagesCache = messages;
                this.messagesLoadingListeners.forEach(l => l(messages));
            });
            return fetchRes;
        }
        loadEnums() {
            let fetchRes = this.fetch('GET', 'v2/metadata/enums', null, { handleAs: 'json' });
            fetchRes.then((enums) => {
                this.enumsCache = enums;
                this.enumsLoadingListeners.forEach(l => l(enums));
            });
            return fetchRes;
        }
        getPermissions() {
            return this.fetch('GET', 'v2/permissions', null, { handleAs: 'json' });
        }
        getUserInfo() {
            return this.fetch('GET', 'v2/userInfo', null, { handleAs: 'json' });
        }
        _getBasicAuthHeaders() {
            return {
                "Accept-Language": this.locale,
                "Authorization": "Basic " + btoa(this.restClientId + ':' + this.restClientSecret),
                "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
            };
        }
        clearAuthData() {
            localStorage.removeItem(this.name + "_" + CubaApp.REST_TOKEN_STORAGE_KEY);
            localStorage.removeItem(this.name + "_" + CubaApp.USER_NAME_STORAGE_KEY);
        }
        fetch(method, path, data, fetchOptions) {
            let url = this.apiUrl + path;
            let settings = {
                method: method,
                headers: {
                    "Accept-Language": this.locale
                }
            };
            if (this.restApiToken) {
                settings.headers["Authorization"] = "Bearer " + this.restApiToken;
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
            let handleAs = fetchOptions ? fetchOptions.handleAs : undefined;
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
        checkStatus(response) {
            if (response.status >= 200 && response.status < 300) {
                return response;
            }
            else {
                return Promise.reject({ message: response.statusText, response: response });
            }
        }
        static isTokenExpiredResponse(resp) {
            return resp && resp.status === 401;
        }
    }
    CubaApp.REST_TOKEN_STORAGE_KEY = 'cubaAccessToken';
    CubaApp.USER_NAME_STORAGE_KEY = 'cubaUserName';
    CubaApp.LOCALE_STORAGE_KEY = 'cubaLocale';
    cuba.CubaApp = CubaApp;
})(cuba || (cuba = {}));
