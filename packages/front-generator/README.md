# CUBA Platform front-end and JS SDK generator

The generator is `@cuba-platform/front-generator` npm package which
 * provides an ability to generate:
    * [Polymer 2 starter](https://doc.cuba-platform.com/manual-7.0/polymer_ui.html)
    * [React starter](src/generators/react-typescript/app/template/README.md)
    * Framework agnostic JS SDK
 * is used by [CUBA Studio](https://doc.cuba-platform.com/studio/) for [front module](https://doc.cuba-platform.com/manual-7.0/front_ui.html) creation

## Using via command line

### Prerequisites

Install [Node.js](https://nodejs.org/en/download/) 10.15+ and npm 6+ (usually comes with node). 

Install the generator using the npm package manager: 

```bash
npm install -g @cuba-platform/front-generator
```

Then you will be able to run it via command line:

```bash
gen-cuba-front
```

## Development
Run locally
```bash
npm run watch
npx gen-cuba-front
```

Test
```bash
npm test
```