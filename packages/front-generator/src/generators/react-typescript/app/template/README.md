## CUBA React Front-end Client

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

#### Supported Browsers

The client supports all modern (evergreen) browsers. 
In order to support IE 9,10,11 [additional configuration](https://facebook.github.io/create-react-app/docs/supported-browsers-features) 
required.

### Getting Started

#### Creating an App

There are two ways to create React client:

1. As a module of CUBA application (using [CUBA Studio](https://doc.cuba-platform.com/studio/#modules)). 
You will be able to create CRUD screens using STUDIO's UI.
2. As a standalone front-end app ([using command line interface](https://github.com/cuba-platform/front-generator/blob/master/README.md#using-via-command-line))
```bash
gen-cuba-front react-typescript
```
See the above link for step-by-step instruction. 

#### Project Layout

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
    cuba/              <- CUBA Model. See [Backend model]
      entitites/       <- Project entities
        base/          <- Entities from addons and framework
      enums/           <- Project enums
```

If client was generated using Studio it's placed in `modules/front` directory of main project. 

### Development

#### Creating React Components

It is highly recommended to read full [React documentation](https://reactjs.org/docs/getting-started.html).
In React, like in many modern frameworks everything is a component. 
We use components to create reusable blocks of our application as well as particular pages and screens. 

Let's create our first component: place file `Button.tsx` in `src` directory: 

```typescript jsx
import React, { Component } from 'react';

export class Button extends Component {
  render() {
    <button>Click me</button>;
  }
}
```

Alternatively, you can create the component using a function:

```typescript jsx
export function Button(props) {
  return <button>{props.name}</button>;
}
```

#### Observable State with MobX

[MobX](https://mobx.js.org/intro/overview.html) is a library for reactive state management which enables to work with 
state in a convenient and concise way. 

Consider the following example:

```typescript jsx
@observer 
class Counter extends React.Component {

  @observable
  count = 0;
  
  render() {
    return (
      <div>
        Counter: {this.count} <br />
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

As soon as we decorate a class or a function component as [observer](https://mobx.js.org/refguide/observer-component.html), it automatically subscribes to changes on any [observable](https://mobx.js.org/refguide/observable.html) value or object i.e. in the example above changing `count` property will result in automatic re-render of the component.

#### CUBA React Components

##### MainStore

`MainStore` contains common application data. It's being initialized using `<CubaAppProvider>`:

```typescript
<CubaAppProvider cubaREST={cubaREST}>
   // App component tree
</CubaAppProvider>
```

You can inject it in any component using `@injectMainStore` decorator:

```typescript
@injectMainStore
@observer
export class AppInfo extends React.Component<MainStoreInjected> {
  render() {
    if (!this.props.mainStore) {
      return null;
    }
    const {
      initialized,
      authenticated,
      userName,
      metadata,
      messages,
      enums
    } = this.props.mainStore;
    return (
      <ul>
        <li>App initialized: {initialized ? 'yes' : 'no'}</li>
        <li>User authenticated: {authenticated ? 'yes' : 'no'}</li>
        <li>User name: {userName}</li>
        <li>Metadata: {JSON.stringify(metadata)}</li>
        <li>Messages: {JSON.stringify(messages)}</li>
        <li>Enums: {JSON.stringify(enums)}</li>
      </ul>
    )
  }
}
```
##### DataCollectionStore
`DataCollectionStore` is a MobX based store for loading entity collections. It can be created via `collection()` initializer function:
```typescript
dataCollection = collection<Pet>(Pet.NAME, {
    view: 'pet-with-owner-and-type',
    sort: 'identificationNumber',
    filter: {conditions: [{property: 'name', operator: "contains", value: 'Ro'}]},
    limit: 10,
    offset: 0,
    loadImmediately: true, // true by default
  }
);
```
Typically it's being used to display list of entities. Since it's reactive, any changes in `items` and `status` will trigger re-render of `@observer` components:
```typescript
@observer
class CarList extends React.Component {
  carsData = collection<Car>(Car.NAME, {view: 'car-view', sort: '-updateTs'});
  render() {
    if (this.carsData.status === "LOADING") return 'Loading...';
    return (
      <ul>
        {this.carsData.items.map(car =>
           <li>{car._instanceName}</li>
        )}
      </ul>
    )
  }
}
``` 

##### DataInstanceStore
`DataInstanceStore` is used to work with a single instance of some Entity. It can be created via `instance()` initializer function:
```typescript
dataInstance = instance<Pet>(Pet.NAME, {view: 'pet-with-owner-and-type', loadImmediately: false});
```
Use `dataInstance.commit()` method to perform entity update:
```typescript
dataInstance.item.name = 'New Name';
dataInstance.commit()
```

##### EntityProperty
`<EntityProperty>` component is aimed to display a value of some Entity's property. It automatically applies formatting according to the type of property and adds corresponding label from global message pack (defined on the backend)
```typescript
<EntityProperty entityName={Pet.NAME}
                propertyName='birthDate'
                value={pet.birthDate}/>
```

##### FormField

`<FormField>` component automatically creates correct Form UI component based on entity and property names:

```typescript
<FormField entityName={Pet.NAME} propertyName='birthDate'/>
```
For the attributes with relationship it's possible to provide instance of DataCollectionStore via `optionsContainer` prop to render options list
```typescript
petTypesDc = collection<PetType>(PetType.NAME, {view: '_minimal', sort: 'name'});
...
<FormField entityName={Pet.NAME}
           propertyName='type'
           optionsContainer={this.petTypesDc}/>
```

##### DataTable

`<DataTable>` is used to present data in tabular form.

![Data table showcase](https://raw.githubusercontent.com/cuba-platform/front-generator/master/etc/react/data-table-demo.gif)

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

### Routing

Routing is based on well-known [React Router](https://reacttraining.com/react-router/web/guides/quick-start) library.
The generated app has a single point (`src/routing.ts`) to define screens which will be automatically placed
in the main menu:

```typescript jsx
mainRoutes.push({
  pathPattern: '/pets', // pattern may be used to consume some parameters, e.g.: /pets/:petId?
  menuLink: '/pest',
  component: PetBrowser, // component to be rendered, should be imported in `routes.ts`
  caption: 'Pets' // Menu item caption
});
```

The `src/App.tsx` contains `Switch` component which renders screen depending on the URL path: 

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

In order to facilitate data binding, Ant Design's [Form](https://ant.design/components/form/) component and utilities
are used in the app. 

`getFieldDecorator` is a useful higher order function which allows you to setup validation and binding. See the following example:

```typescript jsx
  <Form.Item label='name'>
     getFieldDecorator('model', {
       normalize: (value) => {
         return value === '' ? null : value; // Normalize value so that empty string is converted to null
       },
       rules: [ // Allows you to setup front-end validation rules
         {required: true} 
       ]
     })(
        <FormField entityName={Entity.NAME}
                   propertyName='model'/>
     )}
  </Form.Item>
```

#### i18n

i18n is powered by [react-intl](https://github.com/formatjs/react-intl) library.

Out of the box React client supports `en` and `ru` locales.

##### To add new localized content

- Add new messages to `src/i18n/{locale}.json` files
- Refer to them from your code using standard `react-intl` components or API (see [documentation](https://github.com/formatjs/react-intl/blob/master/docs/README.md))
 
##### To override existing messages

Simply replace existing messages in `src/i18n/{locale}.json` files.
This way you can override messages in client app, `cuba-react` components and some of the messages in `antd` components. 

##### Adding support for new locales

- Add a corresponding `{locale}.json` message pack. 
Note that it shall contain messages for `cuba-react` components (keys starting with `cuba-react`) 
and `antd` `Form` validation messages (keys starting with `antd.form.validation`)
- Create a mapping between locale and message pack by modifying `messagesMapping` in `src/i18n/i18nMappings.ts`
- Create a mapping between locale and `antd/es/locale-provider/Locale` object by modifying `antdLocaleMapping` in `src/i18n/i18nMappings.ts`.
> This is required because most of the messages in `antd` components are translated by telling `antd` to use one of the predefined locales.
> An extensive list of locales supported by `antd` can be found [here](https://ant.design/docs/react/i18n).
- Add import of corresponding [moment](https://github.com/moment/moment) locale to `index.tsx`, e.g. `import 'moment/locale/ru';`
> This is required because some of `antd` components use localized messages from `moment`.
- Add means of switching to the new locale. E.g. if you are using the default `LanguageSwitcher` - add an additional locale option into it.

#### Hot Deploy and Dev Server

In order to run development server, use the following command:

```bash
$ npm run start
```

If the client was generated via CUBA Studio (as a module of CUBA application) you can use Gradle in order 
to run npm tooling:

```bash
$ ./gradlew npm_run_start
``` 
> There is a known [bug](https://github.com/srs/gradle-node-plugin/issues/339) in Gradle node plugin which does not
> kill JS development server on task interruption. 

> Hot deploy from Studio to the Tomcat is not supported.

#### Build Scripts

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

### Backend Model

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

* You can easily access entity name by static `NAME` property: `Role.NAME`,
* The class contains all properties of the domain model entity including ones from class hierarchy.
Reference fields have corresponding types as well so that you can work with them in a type-safe manner:  

```typescript
function changeRole(role: Role) {
  role.defaultRole = true;   // ok
  role.defaultRole = 'foo';  // compilation fails  
}
```


#### Synchronizing Project Model

In order to regenerate project model to conform changes in the backend you can use the following command:
 
```bash
$ npm run `update-model`
```

### Theming

Ant Design provides a possibility to [customize theme](https://ant.design/docs/react/customize-theme) using `less` and 
overriding built-in variables. You can also use these variables in your own code.

In order to do so, you will need to make some modifications to the generated app.

> NOTE: you will have to enable deprecated inline Javascript in `less` as `antd` makes heavy use of it.
> [Reasons for deprecation.](http://lesscss.org/usage/#less-options-strict-units)

- Install the required dependencies. Note that we are using [react-app-rewired](https://github.com/timarney/react-app-rewired) to modify the webpack config without having to `eject`.  
```shell script
npm i react-app-rewired less less-loader customize-cra babel-plugin-import --save-dev
```
- Create `config-overrides.js` file in the app root. The file shall look like this. 
```typescript
const {addLessLoader, override, fixBabelImports} = require("customize-cra");
const path = require('path');

module.exports = override(
  fixBabelImports('import', {
      libraryName: 'antd',
      libraryDirectory: 'es',
      style: true,
  }),
  addLessLoader({
    javascriptEnabled: true,
    modifyVars: {
      'overrideTheme': `true; @import "${path.resolve(__dirname, './src/theme.less')}";`,
    },
  }),
);
```
Now you can place your overrides in `src/theme.less`:
```less
@primary-color: #1DA57A;
``` 

You can use `antd` variables in your code like this:
```less
@import "~antd/es/style/themes/default";

body {
  background: @list-header-background;
}
```

References:
 - detailed [documentation](https://ant.design/docs/react/use-with-create-react-app#Customize-Theme) on Ant Design
website

#### CSS Methodology

Both client and CUBA React follow [RSCSS methodology](http://rscss.io).
Additionally we adopt Base Rules from [SMACSS methodology](http://smacss.com/book/type-base).

### Security

Since React client works via Generic REST API endpoints, the backend (CUBA) application should have properly configured Security 
Roles and Access groups. See the [corresponding chapter](https://doc.cuba-platform.com/restapi-7.1/#security) in REST API documentation.
