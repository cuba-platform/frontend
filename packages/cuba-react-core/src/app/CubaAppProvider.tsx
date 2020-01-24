import {CubaApp} from "@cuba-platform/rest";
import * as React from "react";
import {MainStore} from "./MainStore";
import {Provider} from "mobx-react";

let cubaAppContext: React.Context<CubaAppContextValue>;
let globalCubaREST: CubaApp;
let mainStore: MainStore;

export interface CubaAppContextValue {
  cubaREST?: CubaApp;
}

export function getCubaREST(): CubaApp | undefined {
  return globalCubaREST;
}

export function getMainStore(): MainStore {
  return mainStore;
}

export interface CubaAppProviderProps {
  cubaREST: CubaApp;
  children: React.ReactNode | React.ReactNode[] | null;
  restApiTokenPromise?: Promise<string|undefined>;
}

export const CubaAppProvider: React.FC<CubaAppProviderProps> = (
  {
    cubaREST,
    children,
    restApiTokenPromise = Promise.resolve(undefined)
  }
) => {
  const CubaAppContext = getContext();
  return (
    <CubaAppContext.Consumer>
      {(context = {}) => {
        if (cubaREST && context.cubaREST !== cubaREST) {
          globalCubaREST = cubaREST;
          mainStore = new MainStore(cubaREST);
          restApiTokenPromise.then((restApiToken) => {
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
