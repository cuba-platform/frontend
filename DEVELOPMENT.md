# Development

This is a monorepo for the following npm packages:

* [@haulmont/jmix-front-generator](/packages/jmix-front-generator)
* [@haulmont/jmix-rest](/packages/jmix-rest)
* [@haulmont/jmix-react-core](/packages/jmix-react-core)
* [@haulmont/jmix-react-ui](/packages/jmix-react-ui)


## Bootstrap

Perform npm install and lerna bootstrap:

```
npm install
npx lerna bootstrap
```

## Dependencies of Generated App

To update versions of @haulmont/jmix-rest and @cuba-platform/react in generated app [react-app-scr](react-app-scr)

* set new versions in [packages/cuba-rest-js/package.json](packages/jmix-rest/package.json) 
and [packages/cuba-react/package.json](packages/cuba-react/package.json)

* bootstrap backend - clone repository with backend
```bash
npm run bootstrap-jmix-app
```

* start backend
```bash
npm run start-jmix-app
```

* to install local packages to the `example-react-app`:
```bash
npm run update-react-client-libs
```

* to fully regenerate react client app, compile and pack dependencies:
```bash
npm run bootstrap-react-app
```

* start app
```bash
npm run start-react-app
```

## Rebuild and Install Packages To the Generated App During Development

Update all packages:

```bash
npm run update-client-libs
```

Specific package:

```bash
npm run update-react-ui
npm run update-react-core
npm run update-react-core-and-ui
```


## Dependency Audit

Use Snyk wizard to resolve the issues detected by Snyk:

```bash
npm run snyk:wizard -- projectPath
```

where `projectPath` is a relative path to the project, e.g. `packages/cuba-react-ui`.
