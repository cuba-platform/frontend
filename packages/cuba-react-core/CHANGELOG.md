# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [2.0.0](https://github.com/cuba-platform/frontend/tree/master/packages/cuba-react-core/compare/@cuba-platform/react-core@2.0.0-beta.2...@cuba-platform/react-core@2.0.0) (2021-03-12)

**Note:** Version bump only for package @cuba-platform/react-core





# [2.0.0-beta.2](https://github.com/cuba-platform/frontend/tree/master/packages/cuba-react-core/compare/@cuba-platform/react-core@2.0.0-beta.1...@cuba-platform/react-core@2.0.0-beta.2) (2021-03-12)


### Bug Fixes

* fixed issues with composite row key in DataTable ([8f2a585](https://github.com/cuba-platform/frontend/tree/master/packages/cuba-react-core/commit/8f2a5854a2df2380a91cde6b4d1996dd5d44b1db))


### Features

* added support of editing and removing entities with composite keys ([5fbe93a](https://github.com/cuba-platform/frontend/tree/master/packages/cuba-react-core/commit/5fbe93a5f87f5cf586955459cf182427806e484c))





# [2.0.0-beta.1](https://github.com/cuba-platform/frontend/tree/master/packages/cuba-react-core/compare/@cuba-platform/react-core@2.0.0-beta.0...@cuba-platform/react-core@2.0.0-beta.1) (2021-01-21)

**Note:** Version bump only for package @cuba-platform/react-core





# [2.0.0-beta.0](https://github.com/cuba-platform/frontend/tree/master/packages/cuba-react-core/compare/@cuba-platform/react-core@2.0.0-dev.1...@cuba-platform/react-core@2.0.0-beta.0) (2021-01-20)


### Bug Fixes

* login form not shown when session expires [#350](https://github.com/cuba-platform/frontend/tree/master/packages/cuba-react-core/issues/350) ([8e37109](https://github.com/cuba-platform/frontend/tree/master/packages/cuba-react-core/commit/8e371096abb66bead60799efd2192cc1feb070cf))
* mobx-react batching warning ([e3dcc13](https://github.com/cuba-platform/frontend/tree/master/packages/cuba-react-core/commit/e3dcc135c915605fd1ec974fc73cc41a7a68c679))


### Features

* allow to conditionally show content based on permissions ([51ceb8d](https://github.com/cuba-platform/frontend/tree/master/packages/cuba-react-core/commit/51ceb8dc8bdaef0978da237060d56bc9eb8c1415)), closes [#309](https://github.com/cuba-platform/frontend/tree/master/packages/cuba-react-core/issues/309)


### BREAKING CHANGES

* Minimum version requirement for mobx-react is now ^6.3.0





# [1.1.0](https://github.com/cuba-platform/frontend/tree/master/packages/cuba-react-core/compare/@cuba-platform/react-core@1.0.2...@cuba-platform/react-core@1.1.0) (2020-08-04)


### Bug Fixes

* **React:** editor behavior when backend can't be reached ([50168cb](https://github.com/cuba-platform/frontend/tree/master/packages/cuba-react-core/commit/50168cbeb2bb55a129792b0961edbf6870083ddf)), closes [#154](https://github.com/cuba-platform/frontend/tree/master/packages/cuba-react-core/issues/154)


### Features

* support read-only attributes ([69fcbbe](https://github.com/cuba-platform/frontend/tree/master/packages/cuba-react-core/commit/69fcbbed31a949a710ddaab27a444a4f2f6394a3)), closes [#190](https://github.com/cuba-platform/frontend/tree/master/packages/cuba-react-core/issues/190)





## [1.0.2](https://github.com/cuba-platform/frontend/tree/master/packages/cuba-react-core/compare/@cuba-platform/react-core@1.0.1...@cuba-platform/react-core@1.0.2) (2020-06-23)


### Bug Fixes

* datetime is saved with "random" amount of milliseconds [#113](https://github.com/cuba-platform/frontend/tree/master/packages/cuba-react-core/issues/113) ([dea79d0](https://github.com/cuba-platform/frontend/tree/master/packages/cuba-react-core/commit/dea79d089dea58bece9034ae89a0b041213e2a24))





## [1.0.1](https://github.com/cuba-platform/frontend/tree/master/packages/cuba-react-core/compare/@cuba-platform/react-core@1.0.0...@cuba-platform/react-core@1.0.1) (2020-06-15)

**Note:** Version bump only for package @cuba-platform/react-core





# [1.0.0](https://github.com/cuba-platform/frontend/tree/master/packages/cuba-react-core/compare/@cuba-platform/react-core@1.0.0-beta.2...@cuba-platform/react-core@1.0.0) (2020-06-15)


### Bug Fixes

* **Front Generator:** reaction on effective perms for CUBA 7.1 ([541478f](https://github.com/cuba-platform/frontend/tree/master/packages/cuba-react-core/commit/541478f903ba51fc0e57dcac9bd073005b8a915a)), closes [#238](https://github.com/cuba-platform/frontend/tree/master/packages/cuba-react-core/issues/238)


### Features

* support String ID entities ([18ae63b](https://github.com/cuba-platform/frontend/tree/master/packages/cuba-react-core/commit/18ae63baf80d6e353da276a3ec96ef1c1aa53849)), closes [#119](https://github.com/cuba-platform/frontend/tree/master/packages/cuba-react-core/issues/119)


### BREAKING CHANGES

* (Front Generator) react-typescript:entity-management and entity-cards
templates will fail to compile when using @cuba-platform/react-core and
@cuba-platform/react-ui of versions 1.0.0-beta.2 and lower.
* **Front Generator:** effectivePermissions in cuba-react-core Security became private, use isDataLoaded for permissions
load check





# [1.0.0-beta.2](https://github.com/cuba-platform/frontend/tree/master/packages/cuba-react-core/compare/@cuba-platform/react-core@1.0.0-beta.1...@cuba-platform/react-core@1.0.0-beta.2) (2020-05-28)


### Bug Fixes

* compilation fails when entity has integer id ([0821702](https://github.com/cuba-platform/frontend/tree/master/packages/cuba-react-core/commit/082170259b884493bdf1f8d7b2d1158b93810064)), closes [#176](https://github.com/cuba-platform/frontend/tree/master/packages/cuba-react-core/issues/176)
* **React:** editor requests association options regardless of permissions ([79be544](https://github.com/cuba-platform/frontend/tree/master/packages/cuba-react-core/commit/79be54417eee28be40136a43a68f4c39ee893194)), closes [#156](https://github.com/cuba-platform/frontend/tree/master/packages/cuba-react-core/issues/156)





# [1.0.0-beta.1](https://github.com/cuba-platform/frontend/tree/master/packages/cuba-react-core/compare/@cuba-platform/react-core@1.0.0-beta.0...@cuba-platform/react-core@1.0.0-beta.1) (2020-04-30)

**Note:** Version bump only for package @cuba-platform/react-core





# [1.0.0-beta.0](https://github.com/cuba-platform/frontend/compare/release_19.1...@cuba-platform/react-core@1.0.0-beta.0) (2020-04-29)

### Bug Fixes

* no error message when request failed in entity browser ([56c25e5](https://github.com/cuba-platform/frontend/commit/56c25e59554e131b98ece8bfd7c9997a2a6c77a4))
* update dependencies ([0c66b4f](https://github.com/cuba-platform/frontend/commit/0c66b4f5db14829afa0bf54ede710e85417e44bd)), closes [#115](https://github.com/cuba-platform/frontend/issues/115)
* **DataTable:** no error message when filtering fails ([1e0be96](https://github.com/cuba-platform/frontend/commit/1e0be9692362cf01d904e2cb12045146ea088a6d)), closes [#108](https://github.com/cuba-platform/frontend/issues/108)
* **React:** cannot read property 'find' of undefined ([cea06d1](https://github.com/cuba-platform/frontend/commit/cea06d1466aa15f972753fee4b417818274118a5)), closes [#54](https://github.com/cuba-platform/frontend/issues/54)


### Features

* support single-level one-to-one composition ([9bdd20f](https://github.com/cuba-platform/frontend/commit/9bdd20f482508dc182183c63e6aad89ad4843b5a)), closes [#8](https://github.com/cuba-platform/frontend/issues/8)
* **React:** paging solution out of the box - disable pagination ([d564a72](https://github.com/cuba-platform/frontend/commit/d564a724d234a04dc24068d48b746708c008202d)), closes [#61](https://github.com/cuba-platform/frontend/issues/61)
* **React:** support CUBA 7.2 security ([387f8eb](https://github.com/cuba-platform/frontend/commit/387f8eb1eedfb3c52bad56c7330b1e3612cd6897)), closes [#82](https://github.com/cuba-platform/frontend/issues/82)
* allow overriding data transfer/display formats for dates ([c9a6d04](https://github.com/cuba-platform/frontend/commit/c9a6d04c3fa78402d9e002d3fd6d52788990aab0))
* split CUBA React into core and ui packages ([12ce963](https://github.com/cuba-platform/frontend/commit/12ce963d3c54660732e1b933d5c68adf6b239cbd)), closes [#9](https://github.com/cuba-platform/frontend/issues/9)
* support temporal property types ([f55ec9f](https://github.com/cuba-platform/frontend/commit/f55ec9f7c558ef82a4b6699511a2045f9058f949)), closes [#36](https://github.com/cuba-platform/frontend/issues/36)


### BREAKING CHANGES

* CUBA React is split into core and ui packages
