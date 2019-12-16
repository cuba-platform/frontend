# Development

This is a monorepo for the following npm packages:

* [front-generator](/packages/front-generator)
* [cuba-rest-js](/packages/cuba-rest-js)
* [cuba-react](packages/cuba-react)


## Bootstrap

```lerna boostrap```

## Dependencies of Generated App

To update versions of @cuba-platform/rest and @cuba-platform/react in generated app [react-app-scr](react-app-scr)

* set new versions in [packages/cuba-rest-js/package.json](packages/cuba-rest-js/package.json) 
and [packages/cuba-react/package.json](packages/cuba-react/package.json)

* bootstrap client app - compile and pack dependencies, generate client app 
```npm run bootstrap-react-app```

* start backend
`npm run start-cuba-app`

* start app
`npm run start-react-app`

* all-in-one command:
`npm run start-react-all`
