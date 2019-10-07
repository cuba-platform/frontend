## CUBA React front-end client

### Overview

React client is an alternative to [Generic UI](https://doc.cuba-platform.com/manual-latest/gui_framework.html) which 
provides front-end oriented development experience. 
It's more flexible in terms of layout customization and allows easily integrate
 UI libraries and components from vast JavaScript ecosystem. 
 However it requires better knowledge of modern front-end stack. 
 
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
```bash
gen-cuba-front react-typescript
```
See the above link for step-by-step instruction. 

2. As a module of CUBA application (using [CUBA Studio](https://doc.cuba-platform.com/studio/#modules))

#### Project layout

Here is the structure of the newly generated project:

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
    cuba/              <- CUBA Model see [backend model](#backend-model)
      entitites/       <- Project entities
        base/          <- Entities from addons and framework
      enums/           <- Project enums
```

If client was generated using Studio it's placed in `modules/front` directory of main project. 

### Development

#### Creating React Components

We will briefly go through the basics of React here.
It is highly recommended to read full [React documentation](https://reactjs.org/docs/getting-started.html).
In React, like in many modern frameworks everything is a component. We use components to create reusable blocks of our application
as well as particular pages and screens. 

Let's create our first component: place file `Button.tsx` in `src` directory: 

```typescript jsx
import React, { Component } from 'react';

export class Button extends Component {
  render() {
    <button>Click me</button>;
  }
}
```

Alternatively, you can create function component:

```typescript jsx
export function Button(props) {
  return <button>{props.name}</button>;
}
```

##### Observable state with MobX

[MobX](https://mobx.js.org/intro/overview.html) is a library for reactive state management which allows to work with state 
in a convenient and conscious way. 

Consider the following example:

```typescript jsx
@observer 
class Counter extends React.Component {

  @observable
  count = 0
  
  render() {
    return (
      <div>
        Counter {this.count} <br />
        <button onClick={this.handleInc}> + </button>
        <button onClick={this.handleDec}> - </button>
      </div>
    )
  }

  handleInc = () => {
    this.count++;
  }

  handleDec = () => {
    this.count--;
  }
}
```

As soon as we decorate class or function component as [observer](https://mobx.js.org/refguide/observer-component.html) 
it automatically subscribes to changes on any [observable](https://mobx.js.org/refguide/observable.html) value or object
i.e. in the example above changing `count` property will result in automatic re-render of the component.

### Routing

Routing is based on well-known [React Router](https://reacttraining.com/react-router/web/guides/quick-start) library.
The generated app has single point (`src/routing.ts`) to define screens which will be automatically placed
in the main menu:

```typescript jsx
mainRoutes.push({
  pathPattern: '/pets', // pattern may be used to consume some parameters, e.g.: /pets/:petId?
  menuLink: '/pest',
  component: PetBrowser, // component to be rendered, should be imported in `routes.ts`
  caption: 'Pets' // Menu item caption
});
```

The `src/App.tsx` contains `Switch` component which renders screen depending on the url path: 

```typescript jsx
  <Switch>
    <Route exact={true} path="/" component={HomePage}/>
    {mainRoutes.map((route) =>
      <Route key={route.pathPattern} path={route.pathPattern} component={route.component}/>
    )}
  </Switch>
```

You can manually add `Route` to `Switch` component or customize the structure used in `routes.ts` for example in order to create 
hierarchical menu.

### Forms

In order to facilitate data binding Ant Design's [Form](https://ant.design/components/form/) component and utilities
are used in the app. 

`getFieldDecorator` is useful higher order function allows to setup validation and binding, see the following example:

```typescript jsx
  <Form.Item label='name'>
     getFieldDecorator('model', {
       normalize: (value) => {
         return value === '' ? null : value; // Normalize value so that empty string is converted to null
       },
       rules: [ // Allows to setup front-end validation rules
         {required: true} 
       ]
     })(
        <FormField entityName={Entity.NAME}
                   propertyName='model'/>
     )}
  </Form.Item>
```

There is a `<FormField>` component of `@cuba-platform/react` which automatically creates correct UI component
based on entity and property names. However it's possible to use any input component directly.

#### Data Table

`<DataTable>` is used to present data in tabular form.

![Cannot find image](https://raw.githubusercontent.com/cuba-platform/front-generator/master/etc/react/data-table-demo.gif)

It uses Ant Design's [Table](https://ant.design/components/table/) under the hood and provides the following additional
benefits:

- out-of-the-box integration with `DataCollectionStore`
- powerful filters   
- support for action buttons (e.g. for CRUD operations)
 
At the same time `<DataTable>` provides developer with a full access to underlying `Table` via its `tableProps` and `columnProps`
properties (see below). 

Example of using `<DataTable>`'s API:

```html
<DataTable dataCollection={this.dataCollection}
           fields={this.fields}
           onSelectedRowChange={this.onSelectedRowChange}
           buttons={buttons}
           defaultSort={'-updateTs'}
           tableProps={{
             bordered: true
           }}
           columnProps={{
             align: 'right'
           }}
/>
```

- `dataCollection` - instance of `DataCollectionStore`
- `fields` - array of entity property names
- `onSelectedRowChange` - callback that takes the id of selected row, can be used together with `buttons` e.g. to facilitate CRUD operations
- `buttons` - array of React elements representing controls that will be rendered above the table
- `defaultSort` - name of the field to be sorted by. If the name is preceeding by the '+' character, then the sort order is ascending, 
if by the '-' character then descending. If there is no special character before the property name, then ascending sort will be used.
- `tableProps` - can be used to override any of the underlying [Table properties](https://ant.design/components/table/#Table)
- `columnProps` - can be used to override any of the underlying [Column properties](https://ant.design/components/table/#Column).
It shall be used instead of redefining `columns` in `tableProps` if the goal is to extend rather that fully replace the existing
custom column-related functionality.

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
> There is a known [bug](https://github.com/srs/gradle-node-plugin/issues/339) in gradle node plugin which does not
> kill JS development server on task interruption. 

> Hot deploy from Studio to the Tomcat is not supported.

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

### Backend model

`src/cuba` directory contains TypeScript representation of project's entities, views and facades to access REST services.
Here is the layout of the directory:

* `entities` - project entities and views;
* `entities/base` - framework and addons entities;
* `enums` - project enums;
* `services.ts` - middleware services exposed to REST;
* `queries.ts` - REST queries.

Consider the `Role` entity class of CUBA Framework generated in typescript:

`src/cuba/entities/base/sec$Role.ts`
```typescript
export class Role extends StandardEntity {
    static NAME = "sec$Role";
    name?: string | null;
    locName?: string | null;
    description?: string | null;
    type?: any | null;
    defaultRole?: boolean | null;
    permissions?: Permission[] | null;
}
```

* you can easily access entity name by static `NAME` property: `Role.NAME`,
* class contains all properties of domain model entity including from class hierarchy,
reference fields have corresponding types as well so that you can work with them in a type-safe manner:  

```typescript
function changeRole(role: Role) {
  role.defaultRole = true;   // ok
  role.defaultRole = 'foo';  // compilation fails  
}
```


#### Synchronize project model

In order to regenerate project model to conform changes in the backend you can use the following command:
 
```bash
$ npm run `update-model`
```

### Theming

Ant Design provides abilities to [customize theme](https://ant.design/docs/react/customize-theme) using `less` and 
overriding built-in variables.
See the detailed [documentation](https://ant.design/docs/react/use-with-create-react-app#Customize-Theme) on Ant Design
website.

### Security

Since React client works via Generic REST API endpoints, main (CUBA) application should have properly configured Security 
Roles and Access groups. See the corresponding chapter in REST API documentation.
