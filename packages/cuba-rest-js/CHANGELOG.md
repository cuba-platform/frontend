# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [0.7.2](https://github.com/cuba-platform/frontend/tree/master/packages/cuba-rest-js/compare/@cuba-platform/rest@0.7.1...@cuba-platform/rest@0.7.2) (2019-12-27)


### Bug Fixes

* **Menu:** SubMenu has no key prop console warning ([c793906](https://github.com/cuba-platform/frontend/tree/master/packages/cuba-rest-js/commit/c7939064cdca2f49e3fe3dc0316c533b3367f729)), closes [#42](https://github.com/cuba-platform/frontend/tree/master/packages/cuba-rest-js/issues/42)





# Changelog
## 0.7.0
- Added `setSessionLocale` (issue [cuba-platform/front-generator#34](https://github.com/cuba-platform/front-generator/issues/34))
- Added feature detection mechanism (issue [#20](https://github.com/cuba-platform/cuba-rest-js/issues/20))
## 0.6.0
- Added `getFileUploadURL` and `getFile` methods (issue [#14](https://github.com/cuba-platform/cuba-rest-js/issues/14)) 
## 0.5.3
- Moved `PropertyType` type from `cuba-labs/cuba-react`. Added types `double`, `decimal`, `time`. Issue [#12](https://github.com/cuba-platform/cuba-rest-js/issues/12). 
## 0.5.2
- Added `searchEntitiesWithCount` method (issue [#10](https://github.com/cuba-platform/cuba-rest-js/issues/10))
## 0.5.1
- Typings for entities messages
## 0.5.0
- Added `SerializedEntity` type
- Added generic type parameter for fetching methods
## 0.4.1
- Added `PredefinedView` enumeration
## 0.4.0
- Added typings for browser dist
- Added `loadEntityViews` and `loadEntityView` methods
## 0.3.0
- Added methods to load entities and query results with count: `loadEntitiesWithCount`, `queryWithCount`
- Ability to abort request via [AbortController](https://developer.mozilla.org/en-US/docs/Web/API/AbortController)
## 0.2.0
- Added ability to specify custom token endpoint
- Added `searchEntities` method (see [PL-8727](https://youtrack.cuba-platform.com/issue/PL-8727))
