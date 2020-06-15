# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [3.0.0-beta.3](https://github.com/cuba-platform/frontend/tree/master/packages/front-generator/compare/@cuba-platform/front-generator@3.0.0-beta.2...@cuba-platform/front-generator@3.0.0-beta.3) (2020-06-15)


### Bug Fixes

* **Front Generator:** relative project model path not work in cli ([b010c56](https://github.com/cuba-platform/frontend/tree/master/packages/front-generator/commit/b010c561125adbee65c69dccf582b33215302753)), closes [#228](https://github.com/cuba-platform/frontend/tree/master/packages/front-generator/issues/228)
* react-native:app asks to select the project twice ([a2b8c64](https://github.com/cuba-platform/frontend/tree/master/packages/front-generator/commit/a2b8c64663818333f17cfeb69b895f2edb96121f)), closes [#230](https://github.com/cuba-platform/frontend/tree/master/packages/front-generator/issues/230)
* **Front Generator:** answers validation for question type INTEGER ([b0ed633](https://github.com/cuba-platform/frontend/tree/master/packages/front-generator/commit/b0ed6336cab4f3e7211619a9a62729385e5b86ac)), closes [#244](https://github.com/cuba-platform/frontend/tree/master/packages/front-generator/issues/244)
* **Front Generator:** default sort fail if entity not implements updatable ([02e9e23](https://github.com/cuba-platform/frontend/tree/master/packages/front-generator/commit/02e9e23cf4fe92e00b2a40f2e75237a9f56ddc58)), closes [#120](https://github.com/cuba-platform/frontend/tree/master/packages/front-generator/issues/120)
* **Front Generator:** incorrect error message, if project model not found ([06e0743](https://github.com/cuba-platform/frontend/tree/master/packages/front-generator/commit/06e07437c26c4eda95451eb369e1572d87f0f49f)), closes [#227](https://github.com/cuba-platform/frontend/tree/master/packages/front-generator/issues/227)
* **Front Generator:** reaction on effective perms for CUBA 7.1 ([541478f](https://github.com/cuba-platform/frontend/tree/master/packages/front-generator/commit/541478f903ba51fc0e57dcac9bd073005b8a915a)), closes [#238](https://github.com/cuba-platform/frontend/tree/master/packages/front-generator/issues/238)


### Features

* support String ID entities ([18ae63b](https://github.com/cuba-platform/frontend/tree/master/packages/front-generator/commit/18ae63baf80d6e353da276a3ec96ef1c1aa53849)), closes [#119](https://github.com/cuba-platform/frontend/tree/master/packages/front-generator/issues/119)
* **Front Generator:** use rest Client ID and Secret from project model ([7c289f2](https://github.com/cuba-platform/frontend/tree/master/packages/front-generator/commit/7c289f2a66c3deae017ad5f49129a413ba504e99)), closes [#222](https://github.com/cuba-platform/frontend/tree/master/packages/front-generator/issues/222)


### BREAKING CHANGES

* (Front Generator) react-typescript:entity-management and entity-cards
templates will fail to compile when using @cuba-platform/react-core and
@cuba-platform/react-ui of versions 1.0.0-beta.2 and lower.
* **Front Generator:** effectivePermissions in cuba-react-core Security became private, use isDataLoaded for permissions
load check
* **Front Generator:** entity browser sort will not applied for projects generated in Studio before 13 version| studio 12 has an issue with correct defining updatable for entities in project model





# [3.0.0-beta.2](https://github.com/cuba-platform/frontend/tree/master/packages/front-generator/compare/@cuba-platform/front-generator@3.0.0-beta.1...@cuba-platform/front-generator@3.0.0-beta.2) (2020-05-28)


### Bug Fixes

* compilation fails when entity has integer id ([0821702](https://github.com/cuba-platform/frontend/tree/master/packages/front-generator/commit/082170259b884493bdf1f8d7b2d1158b93810064)), closes [#176](https://github.com/cuba-platform/frontend/tree/master/packages/front-generator/issues/176)
* **React:** editor requests association options regardless of permissions ([79be544](https://github.com/cuba-platform/frontend/tree/master/packages/front-generator/commit/79be54417eee28be40136a43a68f4c39ee893194)), closes [#156](https://github.com/cuba-platform/frontend/tree/master/packages/front-generator/issues/156)
* can't save a new entity with a non-empty O2M Composition field ([3eb109c](https://github.com/cuba-platform/frontend/tree/master/packages/front-generator/commit/3eb109c2403e0f31143217274dd42f2484acb7b4)), closes [#213](https://github.com/cuba-platform/frontend/tree/master/packages/front-generator/issues/213)
* **Front Generator:** capitalize component class names ([f5153fa](https://github.com/cuba-platform/frontend/tree/master/packages/front-generator/commit/f5153faa200748a6b20dbeb1a9714226cc5ca602)), closes [#201](https://github.com/cuba-platform/frontend/tree/master/packages/front-generator/issues/201)
* **Front Generator:** sort out duplicated services in projectModel.json ([f081c23](https://github.com/cuba-platform/frontend/tree/master/packages/front-generator/commit/f081c23c8f4656a44281c4052c765a8e5092dd6c)), closes [#184](https://github.com/cuba-platform/frontend/tree/master/packages/front-generator/issues/184)
* **React:** client shall only use project locales [#117](https://github.com/cuba-platform/frontend/tree/master/packages/front-generator/issues/117) ([1537db4](https://github.com/cuba-platform/frontend/tree/master/packages/front-generator/commit/1537db444233237b59a91a81416510fdf1247333))


### Features

* **React:** add entity as generic param to cuba app query call ([109bada](https://github.com/cuba-platform/frontend/tree/master/packages/front-generator/commit/109bada656c17fede4862ccb48408534f1c35ba1))


### BREAKING CHANGES

* **Front Generator:** component generation - names of component classes and files will be generated in camel case notation
with first capital letter





# [3.0.0-beta.1](https://github.com/cuba-platform/frontend/tree/master/packages/front-generator/compare/@cuba-platform/front-generator@3.0.0-beta.0...@cuba-platform/front-generator@3.0.0-beta.1) (2020-04-30)


### Bug Fixes

* **Front Generator:** two letter options (-vb -ds) not work in generator cli ([19c83a3](https://github.com/cuba-platform/frontend/tree/master/packages/front-generator/commit/19c83a3d455add1e44bf80f74b9ccd32a74cc903)), closes [#175](https://github.com/cuba-platform/frontend/tree/master/packages/front-generator/issues/175)
* **React:** add package-lock.json to make gradle node plugin work ([ac0abae](https://github.com/cuba-platform/frontend/tree/master/packages/front-generator/commit/ac0abae5336ef0e689a707ac23b5a9dcfb6b243c)), closes [#189](https://github.com/cuba-platform/frontend/tree/master/packages/front-generator/issues/189)





# [3.0.0-beta.0](https://github.com/cuba-platform/frontend/compare/@cuba-platform/front-generator@2.4.5...@cuba-platform/front-generator@3.0.0-beta.0) (2020-04-29)

### Bug Fixes

* no error message when request failed in entity browser ([56c25e5](https://github.com/cuba-platform/frontend/commit/56c25e59554e131b98ece8bfd7c9997a2a6c77a4))
* **DataTable:** no error message when filtering fails ([1e0be96](https://github.com/cuba-platform/frontend/commit/1e0be9692362cf01d904e2cb12045146ea088a6d)), closes [#108](https://github.com/cuba-platform/frontend/issues/108)
* **React:** cannot read property 'find' of undefined ([cea06d1](https://github.com/cuba-platform/frontend/commit/cea06d1466aa15f972753fee4b417818274118a5)), closes [#54](https://github.com/cuba-platform/frontend/issues/54)
* **React:** fix TypeError [ERR_INVALID_ARG_TYPE] on app startup ([0d0228d](https://github.com/cuba-platform/frontend/commit/0d0228da91655ce7f99c1b801e85085eb252162b)), closes [#131](https://github.com/cuba-platform/frontend/issues/131)
* **React:** screen generated for IntegerIdEntity failed on run ([7acd851](https://github.com/cuba-platform/frontend/commit/7acd851e9c6138b6365fb031987b3cc9fd24f9e6)), closes [#121](https://github.com/cuba-platform/frontend/issues/121)
* display Associations correctly ([f5ea5ff](https://github.com/cuba-platform/frontend/commit/f5ea5ff1eac38a83e24c1c3fbcfe87a5e2752e7f)), closes [#36](https://github.com/cuba-platform/frontend/issues/36)
* do not display byteArray fields ([d029c9c](https://github.com/cuba-platform/frontend/commit/d029c9c6aa67f221b302a119353b97a337696386)), closes [#36](https://github.com/cuba-platform/frontend/issues/36)
* improve 'studio not connected' error message ([65ccceb](https://github.com/cuba-platform/frontend/commit/65ccceb104b072694164965c7b3ce451a6bd7dcc)), closes [#21](https://github.com/cuba-platform/frontend/issues/21)

### Features

* **React Native:** create a template for React Native app ([0ba2ec8](https://github.com/cuba-platform/frontend/commit/0ba2ec89a3f4503a3c8ed8553435bc53b066c091)), closes [#20](https://github.com/cuba-platform/frontend/issues/20)
* improved image preview ([f5aedc0](https://github.com/cuba-platform/frontend/commit/f5aedc00a99a4143c6fccfe56c3dfef50b2ec53f)), closes [#87](https://github.com/cuba-platform/frontend/issues/87)
* **React:** bump react-scripts version to ~3.3.0 ([1d9371a](https://github.com/cuba-platform/frontend/commit/1d9371ac0e190d6aeaaaf250472bfd3ec81ceaf6))
* **React:** component class name generation improvement ([449ce80](https://github.com/cuba-platform/frontend/commit/449ce80d11bcf5986874bc8b1ac38b77e3ef2548)), closes [#70](https://github.com/cuba-platform/frontend/issues/70)
* **React:** generate human readable menu captions ([579b333](https://github.com/cuba-platform/frontend/commit/579b333870bc045c45a2712ce9985f571f06ca07)), closes [#70](https://github.com/cuba-platform/frontend/issues/70)
* **React:** paging - cards template ([fff8371](https://github.com/cuba-platform/frontend/commit/fff8371ed5d6a4eb88b25e7a888529eba46fa18b))
* **React:** paging solution out of the box - list template ([27e1246](https://github.com/cuba-platform/frontend/commit/27e124693bb7264f1259378c06b228bddb510d0f)), closes [#61](https://github.com/cuba-platform/frontend/issues/61)
* **React:** support CUBA 7.2 security ([387f8eb](https://github.com/cuba-platform/frontend/commit/387f8eb1eedfb3c52bad56c7330b1e3612cd6897)), closes [#82](https://github.com/cuba-platform/frontend/issues/82)
* bump TypeScript version to 3.7.4+ ([20cde41](https://github.com/cuba-platform/frontend/commit/20cde41a378addbf09dd4ddf1077fc481bd75a43)), closes [#53](https://github.com/cuba-platform/frontend/issues/53)
* render masked input for property type uuid ([c3ce3eb](https://github.com/cuba-platform/frontend/commit/c3ce3ebee70d941efc011aa4412f3d0c231690d0)), closes [#36](https://github.com/cuba-platform/frontend/issues/36)
* split CUBA React into core and ui packages ([12ce963](https://github.com/cuba-platform/frontend/commit/12ce963d3c54660732e1b933d5c68adf6b239cbd)), closes [#9](https://github.com/cuba-platform/frontend/issues/9)
* update nodejs version to 12+ ([f8f56e7](https://github.com/cuba-platform/frontend/commit/f8f56e76f679bd6ddeeb0a96842c3be6d7acb0f2)), closes [#3](https://github.com/cuba-platform/frontend/issues/3)


### BREAKING CHANGES

* **React:** entity lists  should be regenerated to make paging work
* **DataTable:** PropertyType is now a mandatory prop of DataTableIntervalEditor and
DataTableListEditorDateTimePicker, and a mandatory argument of helper functions
in DataTableIntervalFunctions.ts.
* required nodejs version 12+
* CUBA React is split into core and ui packages
* **React:** Minimum requirement for react-scripts is now version ~3.3.0
* Minimum requirement for TypeScript is now version 3.7.4


## [2.4.5](https://github.com/cuba-platform/frontend/compare/@cuba-platform/front-generator@2.4.4...@cuba-platform/front-generator@2.4.5) (2020-01-23)


### Bug Fixes

* **React:** revert package-lock.json ([3119653](https://github.com/cuba-platform/frontend/commit/3119653d10a5cfb743fd3e7a2787873a4e6c894d)), closes [#81](https://github.com/cuba-platform/frontend/issues/81)





## [2.4.4](https://github.com/cuba-platform/frontend/compare/@cuba-platform/front-generator@2.4.3...@cuba-platform/front-generator@2.4.4) (2020-01-23)

**Note:** Version bump only for package @cuba-platform/front-generator





## [2.4.3](https://github.com/cuba-platform/frontend/compare/@cuba-platform/front-generator@2.4.0...@cuba-platform/front-generator@2.4.3) (2020-01-23)


### Bug Fixes

* **Menu:** SubMenu has no key prop console warning ([c793906](https://github.com/cuba-platform/frontend/commit/c7939064cdca2f49e3fe3dc0316c533b3367f729)), closes [#42](https://github.com/cuba-platform/frontend/issues/42)
* **React:** fix import duplication in editor component ([53d8095](https://github.com/cuba-platform/frontend/commit/53d809597a3f924ed40e74b70f344070de73e9a6)), closes [#62](https://github.com/cuba-platform/frontend/issues/62)


## [2.4.2](https://github.com/cuba-platform/frontend/compare/@cuba-platform/front-generator@2.4.1...@cuba-platform/front-generator@2.4.2) (2019-12-27)

**Note:** Version bump only for package @cuba-platform/front-generator





## [2.4.1](https://github.com/cuba-platform/frontend/compare/@cuba-platform/front-generator@2.4.0...@cuba-platform/front-generator@2.4.1) (2019-12-27)


### Bug Fixes

* **Menu:** SubMenu has no key prop console warning ([c793906](https://github.com/cuba-platform/frontend/commit/c7939064cdca2f49e3fe3dc0316c533b3367f729)), closes [#42](https://github.com/cuba-platform/frontend/issues/42)
