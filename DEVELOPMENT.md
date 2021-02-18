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

## Example React App and Jmix Backend

As an example of using `jmix-front-generator` we generate react app (`example-react-app`) based on jmix sample project 
located in `scr-jmix` folder. Reusable functionality of frontend app is divided to a separate 
npm packages `jmix-rest` `jmix-react-core` `jmix-react-ui`.
During development it becomes necessary to change these packages and update them in frontend app. 
Paragraphs below are described how to do this.


### Backend App

* bootstrap backend - clone repository with backend
```bash
npm run bootstrap-jmix-app
```

* start backend
```bash
npm run start-jmix-app
```

### Frontend App

* to fully regenerate react client app, compile and pack dependencies:
```bash
npm run bootstrap-react-app
```

* start app
```bash
npm run start-react-app
```

### Frontend Libs

* to install local packages to the `example-react-app`:
```bash
npm run update-react-client-libs
```

### Rebuild and Install Packages To the Generated App During Development

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
