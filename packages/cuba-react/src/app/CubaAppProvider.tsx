import {CubaApp} from "@cuba-platform/rest";
import * as React from "react";
import {MainStore} from "./MainStore";
import {Provider} from "mobx-react";
import {Locale} from 'antd/es/locale-provider';
import { I18nProvider } from "../i18n/I18nProvider";

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
  messagesMapping: Record<string, Record<string, string> | undefined>;
  antdLocaleMapping: Record<string, Locale | undefined>;
  children: React.ReactNode | React.ReactNode[] | null;
}

export const CubaAppProvider: React.FC<CubaAppProviderProps> = ({cubaREST, messagesMapping, antdLocaleMapping, children}) => {
  const CubaAppContext = getContext();
  return (
    <CubaAppContext.Consumer>
      {(context = {}) => {
        if (cubaREST && context.cubaREST !== cubaREST) {
          globalCubaREST = cubaREST;
          mainStore = new MainStore(cubaREST);
          mainStore.initialize();
          context = Object.assign({}, context, {cubaREST});
        }

        if (!context.cubaREST) {
          throw new Error("cubaREST instance is not passed")
        }
        return (
          <CubaAppContext.Provider value={context}>
            <Provider mainStore={mainStore}>
              <I18nProvider messagesMapping={messagesMapping} antdLocaleMapping={antdLocaleMapping} mainStore={mainStore}>
                {children}
              </I18nProvider>
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
