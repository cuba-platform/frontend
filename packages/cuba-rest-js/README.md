# CUBA JS SDK
JavaScript library for web and node applications which facilitates using CUBA Platfotm's REST API.
 
## Installation

### npm

```bash
npm install cuba-platform/cuba-js-sdk --save
```
Import as module  
```javascript
const cuba = require('cuba-js-sdk');
```

Or using ES6 imports:

```javascript
import * as cuba from 'cuba-js-sdk';
```

### bower
```bash
bower install cuba-platform/cuba-js-sdk
```
```html
<script src="./bower_components/cuba-js-sdk/dist-browser/cuba.js">
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

## API


## Development

### Tests
```bash
npm run test
```
