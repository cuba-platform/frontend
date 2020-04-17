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

<a name="commits"/>

### Documentation

We use [Antora](https://antora.org/) to generate the [documentation site](https://doc.cuba-platform.com/frontend). Antora uses [AsciiDoc](http://asciidoc.org/) syntax.

Documentation sources are located in the `docs-src` folder:

- `docs-src/api-reference` folder contains the API Reference documentation that is generated from the TSDoc comments.

- The rest of `docs-src` folder are the source files used by Antora.

#### Building the Documentation Site

1. Make sure that the component descriptor (`docs-src/doc-component-repo/antora.yml`) has the correct documentation version (it corresponds to the version of Frontend Generator).

2. Make sure that the playbook file (`docs-src/antora-playbook.yml`) has the correct repo url and branch names. For example, you may want to build the documentation from a feature branch - then you'll need to add the name of that branch. Or you may want to change the remote repo url to the local filesystem path in order to build from your local repo.

3. Update the API Reference with `npm run doc:src`. Commit the changes (and push them if you have specified the remote repo in the playbook file).

4. Run `npm run doc:site`. This will build a site using the repo and the branches specified in the playbook file. The generated site will be placed to the `docs` folder.  

### Making a Commit

Use `npm run commit` instead of `git commit`. This will launch [Commitizen CLI](https://github.com/commitizen/cz-cli). This tool will walk you through creating a conventional commit message. Conventional commits allow generating changelogs and simplify managing of semantic versioning.
