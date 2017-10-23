import { EnumInfo, MetaClassInfo, PermissionInfo, UserInfo } from "./model";
import { EntityFilter } from "./filter";
export * from './model';
export * from './storage';
export * from './filter';
export declare function initializeApp(config?: AppConfig): CubaApp;
export declare function getApp(appName?: string): CubaApp;
export declare function removeApp(appName?: string): void;
export interface AppConfig {
    apiUrl?: string;
    name?: string;
    restClientId?: string;
    restClientSecret?: string;
    defaultLocale?: string;
    storage?: Storage;
}
export interface ResponseError extends Error {
    response?: any;
}
export declare type ContentType = "text" | "json" | "blob";
export interface AbortSignal extends EventTarget {
    aborted: boolean;
}
export interface FetchOptions extends RequestInit {
    handleAs?: ContentType;
    signal?: AbortSignal;
}
export interface EntitiesLoadOptions {
    view?: string;
    sort?: string;
    limit?: number;
    offset?: number;
}
export declare class CubaApp {
    name: string;
    apiUrl: string;
    restClientId: string;
    restClientSecret: string;
    defaultLocale: string;
    private storage;
    private static REST_TOKEN_STORAGE_KEY;
    private static USER_NAME_STORAGE_KEY;
    private static LOCALE_STORAGE_KEY;
    messagesCache: any[];
    enumsCache: any[];
    private tokenExpiryListeners;
    private messagesLoadingListeners;
    private enumsLoadingListeners;
    private localeChangeListeners;
    constructor(name?: string, apiUrl?: string, restClientId?: string, restClientSecret?: string, defaultLocale?: string, storage?: Storage);
    restApiToken: string;
    locale: string;
    /**
     * Logs in user and stores token in provided storage.
     * @param {string} login
     * @param {string} password
     * @param {{tokenEndpoint: string}} options You can use custom endpoints e.g. {tokenEndpoint:'ldap/token'}.
     * @returns {Promise<{access_token: string}>}
     */
    login(login: string, password: string, options?: {
        tokenEndpoint: string;
    }): Promise<{
        access_token: string;
    }>;
    logout(): Promise<any>;
    revokeToken(token: string): Promise<any>;
    loadEntities(entityName: string, options?: EntitiesLoadOptions, fetchOptions?: FetchOptions): Promise<any[]>;
    searchEntities(entityName: string, entityFilter: EntityFilter, options?: EntitiesLoadOptions, fetchOptions?: FetchOptions): Promise<any[]>;
    loadEntity(entityName: string, id: any, options?: {
        view?: string;
    }, fetchOptions?: FetchOptions): Promise<any>;
    deleteEntity(entityName: string, id: any, fetchOptions?: FetchOptions): Promise<any>;
    commitEntity(entityName: string, entity: any, fetchOptions?: FetchOptions): Promise<any>;
    invokeService(serviceName: string, methodName: string, params: any, fetchOptions?: FetchOptions): Promise<any>;
    query(entityName: string, queryName: string, params?: any, fetchOptions?: FetchOptions): Promise<any>;
    queryCount(entityName: string, queryName: string, params?: any, fetchOptions?: FetchOptions): Promise<any>;
    loadMetadata(fetchOptions?: FetchOptions): Promise<MetaClassInfo[]>;
    loadEntityMetadata(entityName: string, fetchOptions?: FetchOptions): Promise<MetaClassInfo>;
    loadEntitiesMessages(fetchOptions?: FetchOptions): Promise<any>;
    loadEnums(fetchOptions?: FetchOptions): Promise<EnumInfo[]>;
    getPermissions(fetchOptions?: FetchOptions): Promise<PermissionInfo[]>;
    getUserInfo(fetchOptions?: FetchOptions): Promise<UserInfo>;
    fetch(method: string, path: string, data?: {}, fetchOptions?: FetchOptions): Promise<any>;
    onLocaleChange(c: any): () => ((locale: string) => {})[];
    onTokenExpiry(c: any): () => (() => {})[];
    onEnumsLoaded(c: any): () => ((enums: any[]) => {})[];
    onMessagesLoaded(c: any): () => ((messages: any[]) => {})[];
    cleanup(): void;
    private isTokenExpiredResponse(resp);
    private _getBasicAuthHeaders();
    private checkStatus(response);
    private clearAuthData();
}
