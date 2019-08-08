## CUBA React front-end client

### Overview

React client is an alternative to [Generic UI](https://doc.cuba-platform.com/manual-latest/gui_framework.html) which 
provides front-end oriented development experience. 
It's more flexible in terms of layout customization and using UI libraries from vast JS ecosystem though
it requires better knowledge of modern front-end stack. 
 
#### Technologies

The client is based on the following frameworks and libraries: 

* [React](https://reactjs.org/) - UI rendering;
* [MobX](https://mobx.js.org/) - reactive state management;
* [Ant Design](https://ant.design/docs/react/introduce) - UI components;
* [React Router](https://reacttraining.com/react-router/) - routing;
* [CUBA React](https://github.com/cuba-labs/cuba-react) - CUBA React components and utilities;
* [CUBA REST JS](https://github.com/cuba-platform/cuba-rest-js) - interaction with СUBA generic REST API;
* [Create React App](https://facebook.github.io/create-react-app/) - build scripts and configuration;

You will need IDE with [TypeScript](http://www.typescriptlang.org/) support: [VSCode](https://code.visualstudio.com/), 
WebStorm or [IntelliJ IDEA](https://www.jetbrains.com/idea/) Ultimate Edition.

#### Supported browsers

The client supports all modern (evergreen) browsers. 
In order to support IE 9,10,11 [additional configuration](https://facebook.github.io/create-react-app/docs/supported-browsers-features) 
required.

### Getting started

#### Creating an app

There are two ways to create React client:

1. As a standalone front-end app ([using command line interface](https://github.com/cuba-platform/front-generator/blob/master/README.md#using-via-command-line))
2. As a module of CUBA application (using [CUBA Studio](https://doc.cuba-platform.com/studio/#modules))

#### Project layout

Here is the structure of the most important project files and directories:

```
app-name/
  package.json
  package-lock.json
  node_modules/
  public/
    index.html
    favicon.ico
  src/
    index.css
    index.tsx          <- App entry point. Do not move/rename this file
    routing.ts         <- Routing configuration
    app/
      App.css
      App.tsx          <- App shell. Switches between Login form and internal application
    cuba/              <- CUBA Model
      entitites/       <- Project entities
        base/          <- Entities from 
```

If client was generated using Studio it's placed in `modules/front` directory. 

### Development

#### Creating React Components

Read [React documentation](https://reactjs.org/docs/components-and-props.html) on components.
Create file with `.tsx` extension and place it in `src` directory. Here is an example of class based component:

```typescript jsx
import React, { Component } from 'react';

export class Button extends Component {
  render() {
    // ...
  }
}
```

#### Hot deploy and dev server

In order to run development server use the following command:

```bash
$ npm run start
```

If the client was generated via CUBA Studio (as a module of CUBA application) you can use gradle in order 
to run npm tooling:

```bash
$ ./gradlew npm_run_start
``` 

> Hot deploy from Studio (to development Tomcat) is not supported.

#### Build scripts

`$ npm run build` command builds your app for production use. See `build` folder.

See [available scripts](https://facebook.github.io/create-react-app/docs/available-scripts) in Create React App documentation.

#### Configuration

By default client deployed to Tomcat is built with production preset and aimed to be served under 
`app-front` context. Use `PUBLIC_URL` env variable to change this behavior (see `.env.production.local`).

The client served from development server has absolute URL of REST API specified in `REACT_APP_CUBA_URL` 
(see `.env.development.local`).

See the [list of all environment](https://facebook.github.io/create-react-app/docs/advanced-configuration) variables
 available for configuration.

See `src/config.ts` for full list of common application settings used in runtime.

### Security

Since React client works via Generic REST API endpoints, main (CUBA) application should have properly configured Security 
Roles and Access groups. See the corresponding chapter in REST API documentation.