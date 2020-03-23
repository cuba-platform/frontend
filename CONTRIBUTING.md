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

We use [Antora](https://antora.org/) to generate the [documentation site](https://cuba-platform.github.io/frontend).

Antora uses the documentation sources from multiple branches of this repo in order to provide the possibility to browse documentation for older versions. More specifically, it uses `master` branch and branches matching the glob `v[0-9]*` (e.g. `v2.4.x`, etc.).

How to make changes to the documentation site:

- Edit `docs-src/doc-component-repo/modules/ROOT/pages/index.adoc`. This is the main source file of the documentation. This file is in [AsciiDoc](http://asciidoc.org/) format.
- Update the front-end generator version in `docs-src/doc-component-repo/antora.yml`.
- Run `npm run doc:src`. This will automatically update the other documentation sources: generate the API Reference docs from TSDoc comments and update the navigation panel source file based on the content of `index.adoc`.
- Commit the changes to the remote (generation uses remote repo, not your local repo).
- Run `npm run doc:site`. This will generate the site from AsciiDoc sources and add the API Reference docs. The generated site is located in `docs` folder.
- Once the changes have made its way to `master` the updated site will be available at [GitHub Pages](https://cuba-platform.github.io/frontend).

### Making a Commit

Use `npm run commit` instead of `git commit`. This will launch [Commitizen CLI](https://github.com/commitizen/cz-cli). This tool will walk you through creating a conventional commit message. Conventional commits allow generating changelogs and simplify managing of semantic versioning.
