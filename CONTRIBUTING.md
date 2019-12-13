## Contributing

<a name="react-client-templates"/>

### Code Generation Templates
The ```template``` folder inside generator is used to create templates from which the code will be generated. 
Templates are processed using [EJS](https://ejs.co/). 
<br>
Template files could be any type,
but to increase code readability for complex files there is an ability to add ```.ejs``` suffix to a template name.
During the file processing the suffix will be removed. 
It means that files ```EntityManagementEditor.tsx.ejs``` and ```EntityManagementEditor.tsx``` both will be processed to file
```EntityManagementEditor.tsx``` and the only difference is how they will be highlighted in IDE. 

<a name="react-client-testing"/>

### Testing

This section explains how to test the generator.

#### Test Folders

`/fixtures` - initial data required for tests.<br>
`/generated` - result of generators work - apps and SDK will be stored here.<br>
`/expected` - files gauges used for comparison with generated code.<br>

#### Unit Tests
```bash
npm test
```

#### Integration Tests
Integration tests use compiled version of front-generator. To apply your code changes you need to run ```npm run build``` before testing.
<br>
Generated Apps and SDK are placed into ```./test/e2e/generated``` directory.

##### Run All E2E Tests
```bash
npm run test:e2e
```

##### E2E Tests for Generators
SDK
```bash
npm run test:e2e:sdk
```
React client
```bash
npm run test:e2e:react
```
Polymer 2
```bash
test:e2e:polymer2
```
Polymer 2 typescript
```bash
test:e2e:polymer2-ts
```
