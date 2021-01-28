## Contributing

<a name="react-client-templates"/>

### Generators

#### Basics and Terminology

`packages/jmix-front-generator` contains the source code for `@haulmont/jmix-front-generator` library which is used for code generation (scaffolding). This library uses [Yeoman](https://yeoman.io/), however, in order to extend and reuse functionality we are using functions composition rather than Yeoman's usual approach of class inheritance. This will be covered in more detail in [How to Write a Generator](#how-to-write-a-generator) section. The code is generated from [EJS](https://ejs.co/) templates. 

This library can be used as a standalone CLI tool, but most of the time it will be used from Studio. When used as a CLI tool it can interactively ask questions and use the **answers** to resolve interpolations in the templates. Studio will ask these questions using its graphical interface and invoke the generator CLI, passing the base64-encoded answers object as `--answers` **option**. There are other options, for example `--dest` that tells the generator where to put the generated files.  

In addition to *answers* and *options* there is a **project model** - information about your Jmix project's entities, fetch plans, services, queries, etc. It can be obtained from Studio.

> EJS template + options + answers + project model = generated code

A **generator** is a combination of an EJS template and code that is responsible for asking questions and turning the answers, options and project model into generated code. For each **client** (e.g. React client, React Native client, etc.) there is always a generator that creates a starter app and zero or more generators that adds the components.

> TIP: use `gen-cuba-front -h` to see the available clients, generators and options.

#### How to Write a Generator

There is a convention that enables CLI/Studio to discover generators. When you want to add a new generator:

1. Create a new folder in `src/generators/{clientName}/{generatorName}`.
2. Add an EJS template (by convention we put it under the `template` directory).
3. Add `index.ts` file. It should contain:

   - A generator class that extends `YeomanGenerator` and contains a constructor and a single method. By convention this method is called `generate`. 
   - An export that looks like this: 
      ```
      export {
         YourGeneratorClassName as generator,
         optionsConfig as options,
         allQuestions as params,
         description
      }
      ```

`optionsConfig` is an `OptionsConfig` object that contains available options. `allQuestions` is a `StudioTemplateProperty` array representing all possible questions that can be asked by this generator. `description` will be shown by CLI and Studio.

`generate` method will contain the generator's logic. Since a lot of logic is duplicated between the generators, we are using the following convention to reuse it.

#### Pipelines and Stages

Generally the process of code generation can be viewed as the following **pipeline**:

```
     +-------------+
     | get options |
     +------+------+
            |
            v
   +--------+---------+
   | configure Yeoman |
   +--------+---------+
            |
            v
  +---------+----------+
  | get project model  |
  +---------+----------+
            |
            v
     +------+------+
     | get answers |
     +------+------+
            |
            v
+-----------+-----------+
| derive template model |
+-----------+-----------+
            |
            v
     +------+------+
     |    write    |
     +------+------+
```

Let us describe the **stages** of this pipeline:

- `get options`: we tell Yeoman what options are allowed and get the values of those options.
- `configure Yeoman`: set the source and destination directory, register transformations, etc.
- `get project model`: read it from file system if the model file path was provided in options, or get it directly from Studio using integration.
- `get answers`: ask questions and get the answers. Or get the answers from options.
- `derive template model`: use answers, options and project model to create a **template model** - a set of data that will be used to resolve interpolations in the template. This stage is kind of like MobX's `@computed`.
- `write`: use the template and template model to resolve the interpolations and write the result to the file system.

To use this pipeline call `defaultPipeline` function in your `generate` method. The arguments:

- `templateDir` - template location. 
- `questions` - an array of all possible questions (if your generator is using any).
- `options` - options config (defaults to `commonGenerationOptionsConfig`).
- `stages` - an object containing your custom implementations of stages:
    - `getOptions`
    - `configureGenerator`
    - `getProjectModel`
    - `getAnswersFromOptions`
    - `getAnswersFromPrompt`
    - `deriveTemplateModel`
    - `write`
    
There are default implementations of stages that are suitable for most cases. Most likely you'll need to customize `getAnswersFromPrompt`, `deriveTemplateModel` and `write`. Implementations of these stages also share some code between themselves. This code is extracted into functions which we put under `src/building-blocks/stages/{stageName}/pieces`. When creating your own reusable functions it is important to give them clear names so that your functions can be easily discovered and reused by fellow developers.

Inside your generator folder, organize your custom code based on the stage it belongs to. For example, put your questions and your implementation of `getAnswersFromPrompt` to `answers.ts`, your `TemplateModel` type and `deriveTemplateModel` implementation to `template-model.ts`, etc. A typical generator folder may look like this:

```
├── answers.ts
├── index.ts
├── options.ts
├── template
│ ├── Cards.tsx.ejs
│ ├── EntityManagementEditor.tsx.ejs
│ ├── EntityManagement.tsx.ejs
│ ├── List.tsx.ejs
│ └── Table.tsx.ejs
├── template-model.ts
└── write.ts
```

If you need to use a different/modified pipeline, write your own analogue of the `defaultPipeline` function. You can still reuse the default implementation of stages that are relevant to you.

#### Templates
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

#### Cross-platforming

When you are working with code, you need to adhere to several recommendations in order for the app to work correctly on both UNIX and Windows OS:

1. Remember that Windows uses "\\" symbol as path separator, but UNIX uses "/". For this reason, you need to use "path" package when you work with paths in code:

```
Examples:

// wrong
const examplePath = 'my/test/directory';

// correct
const examplePath = path.join('my', 'test', 'directory');
``` 

2. Avoid using CLI commands which depend on OS, like 'mkdir -p', 'rm -rf', etc. Instead, use npm packages with CLI that have the same functionality:

```
Examples (package.json scripts):

// wrong
"clean": "rm -rf dist && rm -rf dist-transpiled",
"dist": "npm run compile && mkdir -p dist-browser && browserify --standalone cuba dist-node/cuba.js > dist-browser/cuba.js"

// correct
"clean": "rimraf dist && rimraf dist-transpiled",
"dist": "npm run compile && mkdirp dist-browser && browserify --standalone cuba dist-node/cuba.js > dist-browser/cuba.js"
``` 

3. When you are working with shell scripts, you need to provide `.sh` script for UNIX users and `.bat` for Windows users. Also, you need to implement logic of running `.sh` scripts for UNIX users, and `.bat` for Windows users.

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

### Database

#### Setup database

For work with the project you need to install and setup [PostgreSQL](https://www.postgresql.org/download/). For setup you can use pgAdmin(graphical administration utility) or psql(PostgreSQL cli).

You need to:
- Create user `cuba` with password `cuba`. And set privilege `LOGIN` for the new user.
- Create database with `scr-jmix` name.

Psql exemple:
```
sudo -u postgres psql
postgres=# create database "scr-jmix";
postgres=# create user cuba with encrypted password 'cuba';
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
