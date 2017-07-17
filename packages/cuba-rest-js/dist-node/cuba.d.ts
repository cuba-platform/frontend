declare namespace cuba {
    interface IAppConfig {
        apiUrl: string;
        name?: string;
        restClientId?: string;
        restClientSecret?: string;
        defaultLocale?: string;
    }
    interface IResponseError extends Error {
        response?: any;
    }
    type ContentType = "text" | "json" | "blob";
    interface IFetchOptions extends RequestInit {
        handleAs?: ContentType;
    }
    interface IEntitiesLoadOptions {
        view?: string;
        sort?: string;
        limit?: number;
        offset?: number;
    }
    function initializeApp(config: IAppConfig): CubaApp;
    function getApp(appName?: string): CubaApp;
    class CubaApp {
        name: string;
        apiUrl: string;
        restClientId: string;
        restClientSecret: string;
        defaultLocale: string;
        private static REST_TOKEN_STORAGE_KEY;
        private static USER_NAME_STORAGE_KEY;
        private static LOCALE_STORAGE_KEY;
        messagesCache: any[];
        enumsCache: any[];
        private tokenExpiryListeners;
        private messagesLoadingListeners;
        private enumsLoadingListeners;
        private localeChangeListeners;
        constructor(name?: string, apiUrl?: string, restClientId?: string, restClientSecret?: string, defaultLocale?: string);
        restApiToken: string;
        locale: string;
        login(login: string, password: string): Promise<{
            access_token: string;
        }>;
        logout(): Promise<any>;
        revokeToken(token: string): Promise<any>;
        loadEntities(entityName: any, options?: IEntitiesLoadOptions): Promise<any[]>;
        loadEntity(entityName: any, id: any, options?: {
            view?: string;
        }): Promise<any>;
        deleteEntity(entityName: any, id: any): Promise<any>;
        commitEntity(entityName: string, entity: any): Promise<any>;
        invokeService(serviceName: string, methodName: string, params: any, fetchOptions?: IFetchOptions): Promise<any>;
        query(entityName: string, queryName: string, params?: any): Promise<any>;
        queryCount(entityName: string, queryName: string, params?: any): Promise<any>;
        loadMetadata(): Promise<any>;
        loadEntityMetadata(entityName: string): Promise<any>;
        loadEntitiesMessages(): Promise<any>;
        loadEnums(): Promise<any>;
        getPermissions(): Promise<any>;
        getUserInfo(): Promise<any>;
        fetch(method: any, path: any, data?: any, fetchOptions?: IFetchOptions): Promise<any>;
        onLocaleChange(c: any): () => ((locale: string) => {})[];
        onTokenExpiry(c: any): () => (() => {})[];
        onEnumsLoaded(c: any): () => ((enums: any[]) => {})[];
        onMessagesLoaded(c: any): () => ((messages: any[]) => {})[];
        private isTokenExpiredResponse(resp);
        private _getBasicAuthHeaders();
        private checkStatus(response);
        private clearAuthData();
    }
}
export = cuba;
