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
  dataTransferFormats?: Partial<Record<PropertyType, string>>;
  displayFormats?: Partial<Record<PropertyType, string>>;
}

export interface CubaAppProviderProps {
  cubaREST: CubaApp;
  children: React.ReactNode | React.ReactNode[] | null;
  retrieveRestApiToken?: () => Promise<string|undefined>;
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
