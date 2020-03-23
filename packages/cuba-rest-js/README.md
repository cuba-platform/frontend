# CUBA REST JS

[![Build Status](https://travis-ci.org/cuba-platform/cuba-rest-js.svg?branch=master)](https://travis-ci.org/cuba-platform/cuba-rest-js)

JavaScript library for web and Node.js which facilitates CUBA Platfotm's REST API usage.
 
## Installation

### npm

```bash
npm install @cuba-platform/rest --save
```
Import as module  
```javascript
const cuba = require('@cuba-platform/rest');
```

Or using ES6 imports:

```javascript
import * as cuba from '@cuba-platform/rest';
```

### bower
```bash
bower install cuba-platform/cuba-rest-js
```
```html
<script src="./bower_components/cuba-rest-js/dist-browser/cuba.js">
```


## Dependencies and requirements
Library has no external dependencies. It's assumed that `Promise` and `fetch` -compatible API are available 
or polyfilled i.e. in node environment:
  
```bash
npm install node-fetch --save
```

```javascript
global.fetch = require('node-fetch');
```

## Usage

```javascript
import * as cuba from 'cuba-rest-js';

const app = cuba.initializeApp({
  name: 'myApp',
  apiUrl: 'http://localhost:8080/app/rest/'
});

app.getUserInfo().then((d) => {
  console.log(d);
});

// retrieve app by name

const myApp = cuba.getApp('myApp');
```
or use if you want to manage instances yourself
```javascript
const myApp = new CubaApp("myApp", "http://localhost:8080/app/rest/")
```

```javascript
myApp.loadEntities('sec$User', {view: '_minimal', sort: 'login'}).then((users) => {
  console.log(users);
});
```

[Full API reference](https://cuba-platform.github.io/frontend/latest-cuba-rest-js.html)

## Development

### Tests
In order to run integration tests you need Java to be [installed](https://doc.cuba-platform.com/manual-latest/setup.html).
#### Integration tests
```bash
npm run test:integration
```
#### Running manually
Start test CUBA app
```bash
npm run start-test-app
```
Run tests
```bash
npm test
```
Stop test app
```bash
npm run teardown-test-app
```

### Build
```bash
npm run dist
```

### Lint
```bash
npm run lint
```
