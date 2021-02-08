import * as React from "react";
import * as ReactDOM from "react-dom";
import App from "./app/App";
// import registerServiceWorker from './registerServiceWorker';
import { CubaAppProvider } from "@haulmont/jmix-react-core";
import { I18nProvider } from "@haulmont/jmix-react-ui";
import { HashRouter, Route } from "react-router-dom";
import { initializeApp } from "@haulmont/jmix-rest";
import { CUBA_APP_URL, REST_CLIENT_ID, REST_CLIENT_SECRET } from "./config";
import "mobx-react-lite/batchingForReactDom";
import "antd/dist/antd.min.css";
import "@haulmont/jmix-react-ui/dist/index.min.css";
import "./index.css";
import { antdLocaleMapping, messagesMapping } from "./i18n/i18nMappings";
import "moment/locale/ru";
import { ApolloProvider } from "@apollo/client";
import { createApolloClient } from "./graphql/graphql";

export const cubaREST = initializeApp({
  name: "mpg",
  apiUrl: CUBA_APP_URL,
  restClientId: REST_CLIENT_ID,
  restClientSecret: REST_CLIENT_SECRET,
  storage: window.localStorage,
  defaultLocale: "en"
});

const client = createApolloClient();

ReactDOM.render(
  <CubaAppProvider cubaREST={cubaREST}>
    <ApolloProvider client={client}>
      <I18nProvider
        messagesMapping={messagesMapping}
        antdLocaleMapping={antdLocaleMapping}
      >
        <HashRouter>
          <Route component={App} />
        </HashRouter>
      </I18nProvider>
    </ApolloProvider>
  </CubaAppProvider>,
  document.getElementById("root") as HTMLElement
);
// registerServiceWorker();
