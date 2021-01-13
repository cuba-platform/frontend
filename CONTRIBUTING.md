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

### Coding Conventions

> NOTE: This section is under construction.

#### TypeScript

##### Use Semantically Correct Idioms

Nullish checking:

```typescript
// wrong
if (foo) {}

// correct
if (foo != null) {}
``` 

Nullish coalescing:

```typescript
// wrong
const foo = bar || baz;

// correct
const foo = bar ?? baz;
```

Optional chaining:

```typescript
// wrong
const foobar = foo && foo.bar && foo.bar.baz;

// correct
const foobar = foo?.bar?.baz;
```

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

<a name="commits"/>

### Documentation

We use [Antora](https://antora.org/) to generate the [documentation site](https://doc.cuba-platform.com/frontend). Antora uses [AsciiDoc](http://asciidoc.org/) syntax.

Documentation sources are located in the `docs-src` folder:

- `docs-src/api-reference` folder contains the API Reference documentation that is generated from the TSDoc comments.

- The rest of `docs-src` folder are the source files used by Antora.

#### Building the Documentation Site

1. Make sure that the component descriptor (`docs-src/doc-component-repo/antora.yml`) has the correct documentation version.

2. Make sure that the playbook file (`docs-src/antora-playbook.yml`) has the correct repo url and branch names.

3. Update the API Reference with `npm run doc:src`. Commit the changes (and push them if you have specified the remote repo in the playbook file).

4. Run `npm run doc:site`. This will build a site using the repo and the branches specified in the playbook file. The generated site will be placed to the `docs-build` folder.  

### How to Commit Your Work

#### Conventional Commits

We are using conventional commits. Conventional commits allow generating changelogs and simplify managing of semantic versioning. See [this article](](https://www.conventionalcommits.org/en/v1.0.0/#summary)) for a short overview of the methodology.

Our  commits have the following structure:

```
type(scope): short description #issueNumber

affects: list of libs

long description

BREAKING CHANGE:
description of breaking change
```

Example:

```
 feat(React): support hooks #4
    
    affects: @cuba-platform/react-core, @cuba-platform/react-ui, @cuba-platform/front-generator
    
    Added support for hooks.
    Added utility and convenience hooks:
     - useMainStore
     - useInstance
     - useCollection
    Added support for hooks.
    Added utility and convenience hooks:
     - useMainStore
     - useInstance
     - useCollection
     - useReaction
    Added `entity-management-hooks` template with hooks-based entity
    editor as a proof of concept.
    
    BREAKING CHANGE:
    Increased minium version requirements for dependencies:
     - mobx-react:       ^6.2.2
     - react-router-dom: ^5.2.0
```

When making a commit, it is highly suggested to use `npm run commit` instead of `git commit` or IDE. This will launch [Commitizen CLI](https://github.com/commitizen/cz-cli). This interactive tool will walk you through creating a conventional commit message. Most importantly, it will automatically specify which packages are affected, which is important for both changelogs and versioning.

> NOTE: Don't use `ISSUES CLOSED` as it will automatically close the issue upon merge, which is usually not what we want (issue has to be tested, etc.).

Example of an interactive prompt:

```
? Select the type of change that you're committing: feat:     ✨  A new feature (note: this will indicate a release)
? Denote the scope of this change: 
? Write a short, imperative tense description of the change:
 support bean validation
? Provide a longer description of the change (optional). Use "|" to break new line:
 
? List any BREAKING CHANGES (if none, leave blank):
 
? List any ISSUES CLOSED by this change (optional). E.g.: #31, #34:
 
? The packages that this commit has affected (0 detected)
 (Press <space> to select, <a> to toggle all, <i> to invert selection)
❯◯ @haulmont/jmix-front-generator
 ◯ @haulmont/jmix-react-core
 ◯ @haulmont/jmix-react-ui
 ◯ @haulmont/jmix-rest
 ◯ test-puppeteer
```

We use the following **change types**:

```
feat:     ✨  A new feature (note: this will indicate a release)
fix:      🛠  A bug fix (note: this will indicate a release)
docs:     Documentation only changes
style:    Changes that do not affect the meaning of the code
(white-space, formatting, missing semi-colons, etc)
refactor: A code change that neither fixes a bug nor adds a feature
perf:     A code change that improves performance
test:     Adding missing tests 
chore:    Changes to the build process or auxiliary tools
            and libraries such as documentation generation 
revert:   Revert to a commit 
WIP:      Work in progress 
```

The list of available **scopes** can be found in `commitlint.config.js` file under `rules` -> `scope-enum`. Scope is optional.

Short description should use imperative tense. Long description is optional. Note that both will be automatically included in the changelog.

`BREAKING CHANGES` section should only be included if there are any.

#### Commit Workflow

1. Create a feature branch from `master`. Branch name should be `{initials}/{type}/{issueNumber}/{shortDescription}`, e.g. `pv/feat/34/bean-validation`:

    - `initials` are the first letters of author's first and last name. If the initials are already used by another team member - add additional letters (e.g. first letter of middle name).
    - `type` is type of change, see [Conventional Commits](#conventional-commits).

2. Commit your work and push your branch. Usually one issue = one commit, but you may want to split the changes into several commits to make review easier (for example, you may want to make separate commits for changing documentation sources and updating generated documentation).

3. Create a Pull Request and add reviewers.

4. You may need to make some changes after Peer Review. Since every commit will affect changelog, it's best to squash the changes into your initial commit(s), for example by using [fixup and autosquash](https://stackoverflow.com/a/3828861) and force-pushing your feature branch. Force-pushing is only allowed for your own feature-branches, never force-push master or release branches.
