# CUBA Platform front-end and TypeScript SDK generator

[![Build Status](https://travis-ci.org/cuba-platform/front-generator.svg?branch=master)](https://travis-ci.org/cuba-platform/front-generator)

The generator is `@cuba-platform/front-generator` npm package which
 * provides an ability to generate:
    * [React starter](src/generators/react-typescript/app/template/README.md)
    * [Framework agnostic TS SDK](src/generators/sdk/README.md)
    * [Polymer 2 starter](https://doc.cuba-platform.com/manual-7.0/polymer_ui.html) (deprecated)
 * is used by [CUBA Studio](https://doc.cuba-platform.com/studio/) for [front module](https://doc.cuba-platform.com/manual-7.0/front_ui.html) creation

## Using via command line

### Prerequisites

Install [Node.js](https://nodejs.org/en/download/) 10.15+ and npm 6+ (usually comes with node). Install [CUBA Studio](https://doc.cuba-platform.com/studio/#installation).

Install the generator using the npm package manager: 

```bash
npm install -g @cuba-platform/front-generator
```

Then you will be able to run it via command line:

```bash
gen-cuba-front
```

Alternatively you can also run the generator without installation using `npx`:

```bash
npx @cuba-platform/front-generator
```

### Workflow

In order to create some project-related stuff we need to pass project information to the generator. There are two approaches:

#### Interactive

Open your project in CUBA Studio (Intellij-based). Open settings (`File > Settings`), then open `Languages & Frameworks > CUBA` . Tick the `Old Studio integration` checkbox:

![GitHub Logo](etc/studio-integration.png)

After that when running generator without any options it will automatically detect CUBA projects opened in Studio: 

```bash
gen-cuba-front sdk:all
```
![Interactive project selection](etc/interactive-projects.png)

#### Manual

Alternatively you can export project model manually. In main menu select `CUBA > Advanced > Export project model`. Studio will generate `projectModel.json` file.

Use `--model` cli option to specify destination to project model file:

```bash
gen-cuba-front sdk:all --model /work/cuba-samples/sample-sales/projectModel.json
```


### CLI Options
* `-v, --version`: prints current version of the generator.
* `-h, --help`: prints help for given command.

#### Common generation options 

* `--model`: path to exported project model.
* `--dest`: destination directory (default: current).


## Development
Run locally
```bash
npm run watch
npx gen-cuba-front
```

## Testing

### Test folders

/fixtures - initial data required for tests<br>
/generated - result of generators work - apps and sdk will be stored here<br>
/expected - files gauges used for comparison with generated code<br>


### Run tests
```bash
npm test
```

## Integration tests
Integration tests are used compiled version of front-generator. To apply your code changes you need to run ```npm run build``` before testing.
<br>
Apps and sdk generated in ```./test/e2e/generated``` directory.
### Run all e2e tests
```bash
npm run test:e2e
```

### Generators e2e tests
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
