# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [1.1.0](https://github.com/cuba-platform/frontend/tree/master/packages/cuba-react-ui/compare/@cuba-platform/react-ui@1.0.2...@cuba-platform/react-ui@1.1.0) (2020-08-04)


### Bug Fixes

* entity-management: reuse i18n messages from main message pack ([1cbea10](https://github.com/cuba-platform/frontend/tree/master/packages/cuba-react-ui/commit/1cbea104f3fe3edc221c2f2e1e5800741a90dd41))


### Features

* support read-only attributes ([69fcbbe](https://github.com/cuba-platform/frontend/tree/master/packages/cuba-react-ui/commit/69fcbbed31a949a710ddaab27a444a4f2f6394a3)), closes [#190](https://github.com/cuba-platform/frontend/tree/master/packages/cuba-react-ui/issues/190)





## [1.0.2](https://github.com/cuba-platform/frontend/tree/master/packages/cuba-react-ui/compare/@cuba-platform/react-ui@1.0.1...@cuba-platform/react-ui@1.0.2) (2020-06-23)


### Bug Fixes

* datetime is saved with "random" amount of milliseconds [#113](https://github.com/cuba-platform/frontend/tree/master/packages/cuba-react-ui/issues/113) ([dea79d0](https://github.com/cuba-platform/frontend/tree/master/packages/cuba-react-ui/commit/dea79d089dea58bece9034ae89a0b041213e2a24))





## [1.0.1](https://github.com/cuba-platform/frontend/tree/master/packages/cuba-react-ui/compare/@cuba-platform/react-ui@1.0.0...@cuba-platform/react-ui@1.0.1) (2020-06-15)

**Note:** Version bump only for package @cuba-platform/react-ui





# [1.0.0](https://github.com/cuba-platform/frontend/tree/master/packages/cuba-react-ui/compare/@cuba-platform/react-ui@1.0.0-beta.2...@cuba-platform/react-ui@1.0.0) (2020-06-15)


### Bug Fixes

* **Front Generator:** reaction on effective perms for CUBA 7.1 ([541478f](https://github.com/cuba-platform/frontend/tree/master/packages/cuba-react-ui/commit/541478f903ba51fc0e57dcac9bd073005b8a915a)), closes [#238](https://github.com/cuba-platform/frontend/tree/master/packages/cuba-react-ui/issues/238)


### Features

* support String ID entities ([18ae63b](https://github.com/cuba-platform/frontend/tree/master/packages/cuba-react-ui/commit/18ae63baf80d6e353da276a3ec96ef1c1aa53849)), closes [#119](https://github.com/cuba-platform/frontend/tree/master/packages/cuba-react-ui/issues/119)


### BREAKING CHANGES

* (Front Generator) react-typescript:entity-management and entity-cards
templates will fail to compile when using @cuba-platform/react-core and
@cuba-platform/react-ui of versions 1.0.0-beta.2 and lower.
* **Front Generator:** effectivePermissions in cuba-react-core Security became private, use isDataLoaded for permissions
load check





# [1.0.0-beta.2](https://github.com/cuba-platform/frontend/tree/master/packages/cuba-react-ui/compare/@cuba-platform/react-ui@1.0.0-beta.1...@cuba-platform/react-ui@1.0.0-beta.2) (2020-05-28)


### Bug Fixes

* **React:** editor requests association options regardless of permissions ([79be544](https://github.com/cuba-platform/frontend/tree/master/packages/cuba-react-ui/commit/79be54417eee28be40136a43a68f4c39ee893194)), closes [#156](https://github.com/cuba-platform/frontend/tree/master/packages/cuba-react-ui/issues/156)
* can't save a new entity with a non-empty O2M Composition field ([3eb109c](https://github.com/cuba-platform/frontend/tree/master/packages/cuba-react-ui/commit/3eb109c2403e0f31143217274dd42f2484acb7b4)), closes [#213](https://github.com/cuba-platform/frontend/tree/master/packages/cuba-react-ui/issues/213)
* circular dependencies in react-ui ([074e459](https://github.com/cuba-platform/frontend/tree/master/packages/cuba-react-ui/commit/074e4592d48ef63585729b3df333913b71d72115)), closes [#188](https://github.com/cuba-platform/frontend/tree/master/packages/cuba-react-ui/issues/188)
* fix type of DataTableCustomFilter.ref [#137](https://github.com/cuba-platform/frontend/tree/master/packages/cuba-react-ui/issues/137) ([37ae66f](https://github.com/cuba-platform/frontend/tree/master/packages/cuba-react-ui/commit/37ae66f623c0b24c66bf2a6d60e48e8d44ee85f0))
* fix type of DataTableCustomFilter.ref [#137](https://github.com/cuba-platform/frontend/tree/master/packages/cuba-react-ui/issues/137) ([983efb7](https://github.com/cuba-platform/frontend/tree/master/packages/cuba-react-ui/commit/983efb7bf033a3275b2824c8ca5741a18719ef12))
* relax UUID validation rules ([d323866](https://github.com/cuba-platform/frontend/tree/master/packages/cuba-react-ui/commit/d3238662edd297c9b7f814cea63450a268873a4b)), closes [#197](https://github.com/cuba-platform/frontend/tree/master/packages/cuba-react-ui/issues/197)
* relax UUID validation rules ([584a8df](https://github.com/cuba-platform/frontend/tree/master/packages/cuba-react-ui/commit/584a8df7ec205ca27a4fd1901e9ac79c7db2785b)), closes [#197](https://github.com/cuba-platform/frontend/tree/master/packages/cuba-react-ui/issues/197)
* **DataTable:** error when applying in/notIn filter without adding items ([51abd04](https://github.com/cuba-platform/frontend/tree/master/packages/cuba-react-ui/commit/51abd049768294c9a451917a0d2a7fbc82f207af)), closes [#111](https://github.com/cuba-platform/frontend/tree/master/packages/cuba-react-ui/issues/111)


### BREAKING CHANGES

* Functions getDefaultFieldDecoratorOptions and decorateAndWrapInFormItem
has been removed from public API





# [1.0.0-beta.1](https://github.com/cuba-platform/frontend/tree/master/packages/cuba-react-ui/compare/@cuba-platform/react-ui@1.0.0-beta.0...@cuba-platform/react-ui@1.0.0-beta.1) (2020-04-30)

**Note:** Version bump only for package @cuba-platform/react-ui





# [1.0.0-beta.0](https://github.com/cuba-platform/frontend/compare/release_19.1...@cuba-platform/react-ui@1.0.0-beta.0) (2020-04-29)

### Bug Fixes

* no error message when request failed in entity browser ([56c25e5](https://github.com/cuba-platform/frontend/commit/56c25e59554e131b98ece8bfd7c9997a2a6c77a4))
* update dependencies ([0c66b4f](https://github.com/cuba-platform/frontend/commit/0c66b4f5db14829afa0bf54ede710e85417e44bd)), closes [#115](https://github.com/cuba-platform/frontend/issues/115)
* **DataTable:** don't display filters for unsupported property types ([a45866a](https://github.com/cuba-platform/frontend/commit/a45866ab097c3ef9c87e177de4b33e3a2e180c8f))
* **DataTable:** no error message when filtering fails ([1e0be96](https://github.com/cuba-platform/frontend/commit/1e0be9692362cf01d904e2cb12045146ea088a6d)), closes [#108](https://github.com/cuba-platform/frontend/issues/108)
* **DataTable:** only show columns allowed by user runtime permissions ([ee146bf](https://github.com/cuba-platform/frontend/commit/ee146bf10af2eba25db4915d45760454e6db2936)), closes [#90](https://github.com/cuba-platform/frontend/issues/90)
* display Associations correctly ([f5ea5ff](https://github.com/cuba-platform/frontend/commit/f5ea5ff1eac38a83e24c1c3fbcfe87a5e2752e7f)), closes [#36](https://github.com/cuba-platform/frontend/issues/36)
* **React:** cannot read property 'find' of undefined ([cea06d1](https://github.com/cuba-platform/frontend/commit/cea06d1466aa15f972753fee4b417818274118a5)), closes [#54](https://github.com/cuba-platform/frontend/issues/54)


### Features

* improved image preview ([f5aedc0](https://github.com/cuba-platform/frontend/commit/f5aedc00a99a4143c6fccfe56c3dfef50b2ec53f)), closes [#87](https://github.com/cuba-platform/frontend/issues/87)
* render InputNumber for property types int and double ([e1db9d6](https://github.com/cuba-platform/frontend/commit/e1db9d60b31e8bd0005e0094e48e95c056dfa960)), closes [#36](https://github.com/cuba-platform/frontend/issues/36)
* render InputNumber for property types long and decimal ([8ac86d2](https://github.com/cuba-platform/frontend/commit/8ac86d2a7a44f823659aa08b32d87871d3a42bc6)), closes [#36](https://github.com/cuba-platform/frontend/issues/36)
* render masked input for property type uuid ([c3ce3eb](https://github.com/cuba-platform/frontend/commit/c3ce3ebee70d941efc011aa4412f3d0c231690d0)), closes [#36](https://github.com/cuba-platform/frontend/issues/36)
* split CUBA React into core and ui packages ([12ce963](https://github.com/cuba-platform/frontend/commit/12ce963d3c54660732e1b933d5c68adf6b239cbd)), closes [#9](https://github.com/cuba-platform/frontend/issues/9)
* support single-level one-to-one composition ([9bdd20f](https://github.com/cuba-platform/frontend/commit/9bdd20f482508dc182183c63e6aad89ad4843b5a)), closes [#8](https://github.com/cuba-platform/frontend/issues/8)
* **DataTable:** enable filters for long, uuid and all temporal types ([09a29ca](https://github.com/cuba-platform/frontend/commit/09a29ca9df9e641b5f7a9f9bf8efe73ebcb2b2aa)), closes [#36](https://github.com/cuba-platform/frontend/issues/36)
* **DataTable:** support columns with arbitrary content ([cf7d162](https://github.com/cuba-platform/frontend/commit/cf7d162a4ead576dd35d9bb2b33e2f9a491f2006)), closes [#56](https://github.com/cuba-platform/frontend/issues/56)
* **React:** allow passing props to backed form component ([e5cbdb5](https://github.com/cuba-platform/frontend/commit/e5cbdb59fea520807aa7321ac0edeb76bcf99cbe)), closes [#10](https://github.com/cuba-platform/frontend/issues/10)
* **React:** paging solution out of the box ([18a1a45](https://github.com/cuba-platform/frontend/commit/18a1a4551304fcae124a3a50578b04b4a34ad346)), closes [#61](https://github.com/cuba-platform/frontend/issues/61)
* support temporal property types ([f55ec9f](https://github.com/cuba-platform/frontend/commit/f55ec9f7c558ef82a4b6699511a2045f9058f949)), closes [#36](https://github.com/cuba-platform/frontend/issues/36)


### BREAKING CHANGES

* **React:** entity lists  should be regenerated to make paging work
* **DataTable:** PropertyType is now a mandatory prop of DataTableIntervalEditor and
DataTableListEditorDateTimePicker, and a mandatory argument of helper functions
in DataTableIntervalFunctions.ts.
* **React:** FormField props type has been renamed and changed
* CUBA React is split into core and ui packages
