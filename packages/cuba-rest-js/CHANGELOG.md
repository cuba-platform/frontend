# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [1.0.0-beta.0](https://github.com/cuba-platform/frontend/compare/@cuba-platform/rest@0.7.4...@cuba-platform/rest@1.0.0-beta.0) (2020-04-29)


### Bug Fixes

* update dependencies ([0c66b4f](https://github.com/cuba-platform/frontend/commit/0c66b4f5db14829afa0bf54ede710e85417e44bd)), closes [#115](https://github.com/cuba-platform/frontend/issues/115)
* update minimist ([2c7ffc7](https://github.com/cuba-platform/frontend/commit/2c7ffc788cf058c9f5305e5702932bcdd25e0fc6))


### Features

* **React:** removed support of old security model permiisions ([9929b6a](https://github.com/cuba-platform/frontend/commit/9929b6ad18f3370c648b198149d1216afb6f1a6d))
* **React:** support CUBA 7.2 security ([387f8eb](https://github.com/cuba-platform/frontend/commit/387f8eb1eedfb3c52bad56c7330b1e3612cd6897)), closes [#82](https://github.com/cuba-platform/frontend/issues/82)
* bump TypeScript version to 3.7.4+ ([20cde41](https://github.com/cuba-platform/frontend/commit/20cde41a378addbf09dd4ddf1077fc481bd75a43)), closes [#53](https://github.com/cuba-platform/frontend/issues/53)
* support temporal property types ([f55ec9f](https://github.com/cuba-platform/frontend/commit/f55ec9f7c558ef82a4b6699511a2045f9058f949)), closes [#36](https://github.com/cuba-platform/frontend/issues/36)
* update nodejs version to 12+ ([f8f56e7](https://github.com/cuba-platform/frontend/commit/f8f56e76f679bd6ddeeb0a96842c3be6d7acb0f2)), closes [#3](https://github.com/cuba-platform/frontend/issues/3)


### BREAKING CHANGES

* **React:** cuba-react-core and cuba-rest-js no longer provides methods to get old type security permissions
|use effective permissions from new security rest methods instead
* required nodejs version 12+
* Minimum requirement for TypeScript is now version 3.7.4


## [0.7.2](https://github.com/cuba-platform/frontend/compare/@cuba-platform/rest@0.7.1...@cuba-platform/rest@0.7.2) (2019-12-27)


### Bug Fixes

* **Menu:** SubMenu has no key prop console warning ([c793906](https://github.com/cuba-platform/frontend/commit/c7939064cdca2f49e3fe3dc0316c533b3367f729)), closes [#42](https://github.com/cuba-platform/frontend/issues/42)





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
