import {CubaApp, PropertyType} from "@cuba-platform/rest";
import * as React from "react";
import {MainStore} from "./MainStore";
import {Provider} from "mobx-react";

let cubaAppContext: React.Context<CubaAppContextValue>;
let cubaAppConfig: CubaAppConfig | undefined;
let globalCubaREST: CubaApp;
let mainStore: MainStore;

export interface CubaAppContextValue {
  cubaREST?: CubaApp;
  config?: CubaAppConfig;
}

export function getCubaREST(): CubaApp | undefined {
  return globalCubaREST;
}

export function getMainStore(): MainStore {
  return mainStore;
}

export function getCubaAppConfig(): CubaAppConfig | undefined {
  return cubaAppConfig;
}

export interface CubaAppConfig {
  /**
   * Serialization formats for entity properties of temporal types.
   * Can be used to override the default formats used to (de)serialize the data transferred by REST API.
   * See @{link https://momentjs.com/docs/#/displaying/ | Moment documentation}
   * for details on available formats.
   */
  dataTransferFormats?: Partial<Record<PropertyType, string>>;
  /**
   * Display formats for entity properties of temporal types.
   * Can be used to override the formats used for data presentation.
   * See @{link https://momentjs.com/docs/#/displaying/ | Moment documentation}
   * for details on available formats.
   */
  displayFormats?: Partial<Record<PropertyType, string>>;
}

export interface CubaAppProviderProps {
  /**
   * REST API facade
   */
  cubaREST: CubaApp;
  children: React.ReactNode | React.ReactNode[] | null;
  /**
   * A callback that retrieves REST API token from an external storage.
   * Used, for example, in native mobile apps.
   *
   * @returns a promise that resolves into a `string` representing a valid REST API token
   * or `undefined` if no valid token is available.
   */
  retrieveRestApiToken?: () => Promise<string|undefined>;
  /**
   * Configuration object.
   */
  config?: CubaAppConfig;
}

export const CubaAppProvider: React.FC<CubaAppProviderProps> = (
  {
    cubaREST,
    children,
    retrieveRestApiToken = () => Promise.resolve(undefined),
    config
  }
) => {
  const CubaAppContext = getContext();
  return (
    <CubaAppContext.Consumer>
      {(context = {}) => {
        if (cubaREST && context.cubaREST !== cubaREST) {
          cubaAppConfig = config;
          globalCubaREST = cubaREST;
          mainStore = new MainStore(cubaREST);
          retrieveRestApiToken().then((restApiToken) => {
            if (restApiToken != null) {
              cubaREST.restApiToken = restApiToken;
            }
            mainStore.initialize();
          });
          context = Object.assign({}, context, {cubaREST});
        }

        if (!context.cubaREST) {
          throw new Error("cubaREST instance is not passed")
        }
        return (
          <CubaAppContext.Provider value={context}>
            <Provider mainStore={mainStore}>
              {children}
            </Provider>
          </CubaAppContext.Provider>
        );
      }}
    </CubaAppContext.Consumer>
  );
};

function getContext() {
  if (!cubaAppContext) {
    cubaAppContext = React.createContext<CubaAppContextValue>({});
  }
  return cubaAppContext;
}
