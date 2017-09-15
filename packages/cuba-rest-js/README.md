# CUBA JS
JavaScript library for web and Node.js which facilitates CUBA Platfotm's REST API usage.
 
## Installation

### npm

```bash
npm install cuba-platform/cuba-rest-js --save
```
Import as module  
```javascript
const cuba = require('cuba-rest-js');
```

Or using ES6 imports:

```javascript
import * as cuba from 'cuba-rest-js';
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
fetch = require('node-fetch');
```

## Usage

```javascript
import * as cuba from 'cuba-rest-js';

const app = cuba.initializeApp({});
app.getUserInfo().then((d) => {
  console.log(d);
})
```


## Development

### Tests
```bash
npm test
```
### Build
```bash
npm run dist
```

### Lint
```bash
npm run lint
```