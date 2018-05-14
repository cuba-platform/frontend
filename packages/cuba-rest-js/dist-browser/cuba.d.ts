import { EntitiesWithCount, EnumInfo, MetaClassInfo, PermissionInfo, UserInfo, View } from "./model";
import { EntityFilter } from "./filter";

declare namespace cuba {

   /**
   * Initializes app.
   * @param {AppConfig} config
   * @returns {CubaApp}
   */
  export function initializeApp(config?: AppConfig): CubaApp;
  /**
   * Retrieve previously initialized app by name.
   * @param {string} appName
   * @returns {CubaApp | null}
   */
  export function getApp(appName?: string): CubaApp | null;
  export function removeApp(appName?: string): void;
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
  export type ContentType = "text" | "json" | "blob" | "raw";
  export interface FetchOptions extends RequestInit {
      handleAs?: ContentType;
  }
  export interface EntitiesLoadOptions {
      view?: string;
      sort?: string;
      limit?: number;
      offset?: number;
  }
  export interface LoginOptions {
      tokenEndpoint: string;
  }
  export class CubaApp {
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
       * @param {LoginOptions} options You can use custom endpoints e.g. {tokenEndpoint:'ldap/token'}.
       * @returns {Promise<{access_token: string}>}
       */
      login(login: string, password: string, options?: LoginOptions): Promise<{
          access_token: string;
      }>;
      logout(): Promise<any>;
      revokeToken(token: string): Promise<any>;
      loadEntities(entityName: string, options?: EntitiesLoadOptions, fetchOptions?: FetchOptions): Promise<any[]>;
      loadEntitiesWithCount(entityName: string, options?: EntitiesLoadOptions, fetchOptions?: FetchOptions): Promise<EntitiesWithCount<any>>;
      searchEntities(entityName: string, entityFilter: EntityFilter, options?: EntitiesLoadOptions, fetchOptions?: FetchOptions): Promise<any[]>;
      loadEntity(entityName: string, id: any, options?: {
          view?: string;
      }, fetchOptions?: FetchOptions): Promise<any>;
      deleteEntity(entityName: string, id: any, fetchOptions?: FetchOptions): Promise<any>;
      commitEntity(entityName: string, entity: any, fetchOptions?: FetchOptions): Promise<any>;
      invokeService(serviceName: string, methodName: string, params: any, fetchOptions?: FetchOptions): Promise<any>;
      query(entityName: string, queryName: string, params?: any, fetchOptions?: FetchOptions): Promise<any>;
      queryWithCount(entityName: string, queryName: string, params?: any, fetchOptions?: FetchOptions): Promise<EntitiesWithCount<any>>;
      queryCount(entityName: string, queryName: string, params?: any, fetchOptions?: FetchOptions): Promise<any>;
      loadMetadata(fetchOptions?: FetchOptions): Promise<MetaClassInfo[]>;
      loadEntityMetadata(entityName: string, fetchOptions?: FetchOptions): Promise<MetaClassInfo>;
      loadEntityViews(entityName: string, fetchOptions?: FetchOptions): Promise<View[]>;
      loadEntityView(entityName: string, viewName: string, fetchOptions?: FetchOptions): Promise<View>;
      loadEntitiesMessages(fetchOptions?: FetchOptions): Promise<any>;
      loadEnums(fetchOptions?: FetchOptions): Promise<EnumInfo[]>;
      getPermissions(fetchOptions?: FetchOptions): Promise<PermissionInfo[]>;
      getUserInfo(fetchOptions?: FetchOptions): Promise<UserInfo>;
      fetch(method: string, path: string, data?: any, fetchOptions?: FetchOptions): Promise<any>;
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

}
export = cuba;
export as namespace cuba;