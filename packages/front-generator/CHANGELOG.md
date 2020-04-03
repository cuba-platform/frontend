# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [3.0.0-alpha.0](https://github.com/cuba-platform/frontend/tree/master/packages/front-generator/compare/@cuba-platform/front-generator@2.4.5...@cuba-platform/front-generator@3.0.0-alpha.0) (2020-04-03)


### Bug Fixes

* no error message when request failed in entity browser ([53a5ff3](https://github.com/cuba-platform/frontend/tree/master/packages/front-generator/commit/53a5ff30b2699a5ce792a5118e7c46c42c4ecd7d))
* no error message when request failed in entity browser ([56c25e5](https://github.com/cuba-platform/frontend/tree/master/packages/front-generator/commit/56c25e59554e131b98ece8bfd7c9997a2a6c77a4))
* **DataTable:** no error message when filtering fails ([1e0be96](https://github.com/cuba-platform/frontend/tree/master/packages/front-generator/commit/1e0be9692362cf01d904e2cb12045146ea088a6d)), closes [#108](https://github.com/cuba-platform/frontend/tree/master/packages/front-generator/issues/108)
* **React:** cannot read property 'find' of undefined ([cea06d1](https://github.com/cuba-platform/frontend/tree/master/packages/front-generator/commit/cea06d1466aa15f972753fee4b417818274118a5)), closes [#54](https://github.com/cuba-platform/frontend/tree/master/packages/front-generator/issues/54)
* **React:** fix TypeError [ERR_INVALID_ARG_TYPE] on app startup ([0d0228d](https://github.com/cuba-platform/frontend/tree/master/packages/front-generator/commit/0d0228da91655ce7f99c1b801e85085eb252162b)), closes [#131](https://github.com/cuba-platform/frontend/tree/master/packages/front-generator/issues/131)
* **React:** screen generated for IntegerIdEntity failed on run ([7acd851](https://github.com/cuba-platform/frontend/tree/master/packages/front-generator/commit/7acd851e9c6138b6365fb031987b3cc9fd24f9e6)), closes [#121](https://github.com/cuba-platform/frontend/tree/master/packages/front-generator/issues/121)
* display Associations correctly ([f5ea5ff](https://github.com/cuba-platform/frontend/tree/master/packages/front-generator/commit/f5ea5ff1eac38a83e24c1c3fbcfe87a5e2752e7f)), closes [#36](https://github.com/cuba-platform/frontend/tree/master/packages/front-generator/issues/36)
* do not display byteArray fields ([d029c9c](https://github.com/cuba-platform/frontend/tree/master/packages/front-generator/commit/d029c9c6aa67f221b302a119353b97a337696386)), closes [#36](https://github.com/cuba-platform/frontend/tree/master/packages/front-generator/issues/36)
* **React:** improve 'studio not connected' error message ([65ccceb](https://github.com/cuba-platform/frontend/tree/master/packages/front-generator/commit/65ccceb104b072694164965c7b3ce451a6bd7dcc)), closes [#21](https://github.com/cuba-platform/frontend/tree/master/packages/front-generator/issues/21)


### Features

* improved image preview ([f5aedc0](https://github.com/cuba-platform/frontend/tree/master/packages/front-generator/commit/f5aedc00a99a4143c6fccfe56c3dfef50b2ec53f)), closes [#87](https://github.com/cuba-platform/frontend/tree/master/packages/front-generator/issues/87)
* support single-level one-to-many composition ([33a72fc](https://github.com/cuba-platform/frontend/tree/master/packages/front-generator/commit/33a72fc5d8ddb615981582b87f2f54708a8f060c))
* support single-level one-to-many composition ([f8cd449](https://github.com/cuba-platform/frontend/tree/master/packages/front-generator/commit/f8cd44988307af807ba846d00720e63db605f147)), closes [#8](https://github.com/cuba-platform/frontend/tree/master/packages/front-generator/issues/8)
* support single-level one-to-one composition ([9bdd20f](https://github.com/cuba-platform/frontend/tree/master/packages/front-generator/commit/9bdd20f482508dc182183c63e6aad89ad4843b5a)), closes [#8](https://github.com/cuba-platform/frontend/tree/master/packages/front-generator/issues/8)
* **DataTable:** enable filters for long, uuid and all temporal types ([09a29ca](https://github.com/cuba-platform/frontend/tree/master/packages/front-generator/commit/09a29ca9df9e641b5f7a9f9bf8efe73ebcb2b2aa)), closes [#36](https://github.com/cuba-platform/frontend/tree/master/packages/front-generator/issues/36)
* **React:** bump react-scripts version to ~3.3.0 ([1d9371a](https://github.com/cuba-platform/frontend/tree/master/packages/front-generator/commit/1d9371ac0e190d6aeaaaf250472bfd3ec81ceaf6))
* **React:** component class name generation improvement ([449ce80](https://github.com/cuba-platform/frontend/tree/master/packages/front-generator/commit/449ce80d11bcf5986874bc8b1ac38b77e3ef2548)), closes [#70](https://github.com/cuba-platform/frontend/tree/master/packages/front-generator/issues/70)
* **React:** generate human readable menu captions ([579b333](https://github.com/cuba-platform/frontend/tree/master/packages/front-generator/commit/579b333870bc045c45a2712ce9985f571f06ca07)), closes [#70](https://github.com/cuba-platform/frontend/tree/master/packages/front-generator/issues/70)
* **React:** paging - cards template ([fe7658f](https://github.com/cuba-platform/frontend/tree/master/packages/front-generator/commit/fe7658fc3a86bb63eebc61ee38124086834d70f0))
* **React:** paging - cards template ([fff8371](https://github.com/cuba-platform/frontend/tree/master/packages/front-generator/commit/fff8371ed5d6a4eb88b25e7a888529eba46fa18b))
* **React:** paging solution out of the box - disable pagination ([d564a72](https://github.com/cuba-platform/frontend/tree/master/packages/front-generator/commit/d564a724d234a04dc24068d48b746708c008202d)), closes [#61](https://github.com/cuba-platform/frontend/tree/master/packages/front-generator/issues/61)
* **React:** paging solution out of the box - list template ([27e1246](https://github.com/cuba-platform/frontend/tree/master/packages/front-generator/commit/27e124693bb7264f1259378c06b228bddb510d0f)), closes [#61](https://github.com/cuba-platform/frontend/tree/master/packages/front-generator/issues/61)
* **React:** support CUBA 7.2 security ([387f8eb](https://github.com/cuba-platform/frontend/tree/master/packages/front-generator/commit/387f8eb1eedfb3c52bad56c7330b1e3612cd6897)), closes [#82](https://github.com/cuba-platform/frontend/tree/master/packages/front-generator/issues/82)
* bump TypeScript version to 3.7.4+ ([20cde41](https://github.com/cuba-platform/frontend/tree/master/packages/front-generator/commit/20cde41a378addbf09dd4ddf1077fc481bd75a43)), closes [#53](https://github.com/cuba-platform/frontend/tree/master/packages/front-generator/issues/53)
* render masked input for property type uuid ([c3ce3eb](https://github.com/cuba-platform/frontend/tree/master/packages/front-generator/commit/c3ce3ebee70d941efc011aa4412f3d0c231690d0)), closes [#36](https://github.com/cuba-platform/frontend/tree/master/packages/front-generator/issues/36)
* split CUBA React into core and ui packages ([12ce963](https://github.com/cuba-platform/frontend/tree/master/packages/front-generator/commit/12ce963d3c54660732e1b933d5c68adf6b239cbd)), closes [#9](https://github.com/cuba-platform/frontend/tree/master/packages/front-generator/issues/9)
* update nodejs version to 12+ ([f8f56e7](https://github.com/cuba-platform/frontend/tree/master/packages/front-generator/commit/f8f56e76f679bd6ddeeb0a96842c3be6d7acb0f2)), closes [#3](https://github.com/cuba-platform/frontend/tree/master/packages/front-generator/issues/3)
* **React Native:** create a template for React Native app ([0ba2ec8](https://github.com/cuba-platform/frontend/tree/master/packages/front-generator/commit/0ba2ec89a3f4503a3c8ed8553435bc53b066c091)), closes [#20](https://github.com/cuba-platform/frontend/tree/master/packages/front-generator/issues/20)


### BREAKING CHANGES

* **React:** entity lists  should be regenerated to make paging work
* **DataTable:** PropertyType is now a mandatory prop of DataTableIntervalEditor and
DataTableListEditorDateTimePicker, and a mandatory argument of helper functions
in DataTableIntervalFunctions.ts.
* required nodejs version 12+
* CUBA React is split into core and ui packages
* **React:** Minimum requirement for react-scripts is now version ~3.3.0
* Minimum requirement for TypeScript is now version 3.7.4





## [2.4.5](https://github.com/cuba-platform/frontend/tree/master/packages/front-generator/compare/@cuba-platform/front-generator@2.4.4...@cuba-platform/front-generator@2.4.5) (2020-01-23)


### Bug Fixes

* **React:** revert package-lock.json ([3119653](https://github.com/cuba-platform/frontend/tree/master/packages/front-generator/commit/3119653d10a5cfb743fd3e7a2787873a4e6c894d)), closes [#81](https://github.com/cuba-platform/frontend/tree/master/packages/front-generator/issues/81)





## [2.4.4](https://github.com/cuba-platform/frontend/tree/master/packages/front-generator/compare/@cuba-platform/front-generator@2.4.3...@cuba-platform/front-generator@2.4.4) (2020-01-23)

**Note:** Version bump only for package @cuba-platform/front-generator





## [2.4.3](https://github.com/cuba-platform/frontend/tree/master/packages/front-generator/compare/@cuba-platform/front-generator@2.4.0...@cuba-platform/front-generator@2.4.3) (2020-01-23)


### Bug Fixes

* **Menu:** SubMenu has no key prop console warning ([c793906](https://github.com/cuba-platform/frontend/tree/master/packages/front-generator/commit/c7939064cdca2f49e3fe3dc0316c533b3367f729)), closes [#42](https://github.com/cuba-platform/frontend/tree/master/packages/front-generator/issues/42)
* **React:** fix import duplication in editor component ([53d8095](https://github.com/cuba-platform/frontend/tree/master/packages/front-generator/commit/53d809597a3f924ed40e74b70f344070de73e9a6)), closes [#62](https://github.com/cuba-platform/frontend/tree/master/packages/front-generator/issues/62)


## [2.4.2](https://github.com/cuba-platform/frontend/tree/master/packages/front-generator/compare/@cuba-platform/front-generator@2.4.1...@cuba-platform/front-generator@2.4.2) (2019-12-27)

**Note:** Version bump only for package @cuba-platform/front-generator





## [2.4.1](https://github.com/cuba-platform/frontend/tree/master/packages/front-generator/compare/@cuba-platform/front-generator@2.4.0...@cuba-platform/front-generator@2.4.1) (2019-12-27)


### Bug Fixes

* **Menu:** SubMenu has no key prop console warning ([c793906](https://github.com/cuba-platform/frontend/tree/master/packages/front-generator/commit/c7939064cdca2f49e3fe3dc0316c533b3367f729)), closes [#42](https://github.com/cuba-platform/frontend/tree/master/packages/front-generator/issues/42)
