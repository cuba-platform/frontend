import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './app/App';
// import registerServiceWorker from './registerServiceWorker';
import {Provider} from "mobx-react";
import {AppState} from "./app/AppState";

import {HashRouter, Route} from "react-router-dom";
import {initializeApp} from "@cuba-platform/rest";
import {CUBA_APP_URL} from "./config";

import 'antd/dist/antd.css';
import './index.css';

export const cubaREST = initializeApp({
  name: '<%=project.namespace%>',
  apiUrl: CUBA_APP_URL,
  storage: window.localStorage
});

const appState = new AppState();
appState.initialize();


ReactDOM.render(
  <Provider appState={appState}>
    <HashRouter>
      <Route component={App}/>
    </HashRouter>
  </Provider>
  ,
  document.getElementById('root') as HTMLElement
);
// registerServiceWorker();