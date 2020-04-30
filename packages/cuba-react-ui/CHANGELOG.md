# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

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
