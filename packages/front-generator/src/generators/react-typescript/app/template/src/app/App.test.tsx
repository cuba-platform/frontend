import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';
import {MainStore} from "@cuba-platform/react";
import {initializeApp} from "@cuba-platform/rest";

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App mainStore={new MainStore(initializeApp())} />, div);
  ReactDOM.unmountComponentAtNode(div);
});
