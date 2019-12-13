Monorepo for CUBA frontend packages, see

* [front-generator](/packages/front-generator)
* [cuba-rest-js](/packages/cuba-rest-js)
* [cuba-react](packages/cuba-react)

# Development

## Dependencies of Generated App

To update versions of @cuba-platform/rest and @cuba-platform/react in generated app [react-app-scr](react-app-scr)

* set new versions in [packages/cuba-rest-js/package.json](packages/cuba-rest-js/package.json) 
and [packages/cuba-react/package.json](packages/cuba-react/package.json)

* bootstrap client app - compile and pack dependencies, generate client app 
```npm run bootstrap-client-app```

* start app (assumed that backend already running)
```cd react-client-scr && npm start```
