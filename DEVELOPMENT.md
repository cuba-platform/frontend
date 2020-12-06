# Development

This is a monorepo for the following npm packages:

* [@haulmont/jmix-front-generator](/packages/jmix-front-generator)
* [@haulmont/jmix-rest](/packages/jmix-rest)
* [@haulmont/jmix-react-core](/packages/jmix-react-core)
* [@haulmont/jmix-react-ui](/packages/jmix-react-ui)


## Bootstrap

Install [Lerna](https://lerna.js.org/):
```
npm i -g lerna@~3.19
```

Perform npm install and lerna bootstrap:

```
npm install
lerna boostrap
```

## Dependencies of Generated App

To update versions of @cuba-platform/rest and @cuba-platform/react in generated app [react-app-scr](react-app-scr)

* set new versions in [packages/cuba-rest-js/package.json](packages/jmix-rest-js/package.json) 
and [packages/cuba-react/package.json](packages/cuba-react/package.json)

* bootstrap client app - compile and pack dependencies, generate client app 
```bash
npm run bootstrap-react-app
```

* bootstrap and start backend
```bash
npm run bootstrap-cuba-app && npm run start-cuba-app
```

* start app
```bash
npm run start-react-app
```

* all-in-one command:
```bash
npm run react-all
```

## Rebuild and Install Dependencies During Development
```bash
npm run update-client-libs
```

## Dependency Audit

Use Snyk wizard to resolve the issues detected by Snyk:

```bash
npm run snyk:wizard -- projectPath
```

where `projectPath` is a relative path to the project, e.g. `packages/cuba-react-ui`.
